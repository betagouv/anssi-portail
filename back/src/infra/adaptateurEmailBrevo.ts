import axiosSécurisé, { isAxiosError } from '@anssi-portail/axios';
import { decode } from 'html-entities';
import { BadgeCyberdépartDébloqué } from '../bus/evenements/badgeCyberdepartDebloque.js';
import { MesureConsultee } from '../bus/evenements/mesureConsultee.js';
import { MesurePriseEnCompte } from '../bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../bus/evenements/moduleTermine.js';
import { ParcoursChangé } from '../bus/evenements/parcoursChange.js';
import { ParcoursRejoint } from '../bus/evenements/parcoursRejoint.js';
import { AdaptateurEmail } from '../metier/adaptateurEmail.js';
import { Telephone } from '../metier/telephone.js';
import { adaptateurEmailConsole } from './adaptateurEmailConsole.js';
import { ClientHttp } from './clientHttp.js';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';
import { AdaptateurHorloge } from './adaptateurHorloge.js';
import { ParcoursAllégéTerminé } from '../bus/evenements/parcoursAllegeTermine.js';
import { ParcoursCompletTerminé } from '../bus/evenements/parcoursCompletTermine.js';
import { Parcours } from '../metier/parcours.js';

export type DonnéesUtilisateurBrevo = {
  email: string;
  attributes: {
    DATE_DEBLOCAGE_BADGE_CYBERDEPART?: Date;
    DATE_DERNIERE_COMPLETION_MODULE?: Date;
    DATE_DERNIERE_CONSULTATION_MESURE?: Date;
    DATE_DERNIERE_PRISE_EN_COMPTE_MESURE?: Date;
    NOMBRE_MESURES_PRISES_EN_COMPTE?: number;
    NOMBRE_MODULES_TERMINES?: number;
    PARCOURS: Parcours;
  };
};

type NomÉvénementBrévo =
  | 'badge_cyberdepart_debloque'
  | 'mesure_consultee'
  | 'mesure_prise_en_compte'
  | 'module_termine'
  | 'parcours_allege_termine'
  | 'parcours_change'
  | 'parcours_complet_termine'
  | 'parcours_rejoint';

export type ÉvénementBrevo = {
  email: string;
  nomÉvénement: NomÉvénementBrévo;
  propriétésÀMettreÀJour?: Partial<DonnéesUtilisateurBrevo['attributes']>;
};

class AdaptateurEmailBrevo implements AdaptateurEmail {
  private readonly enteteJSON: { headers: Record<string, string> };

  constructor(
    private readonly clientHttp: ClientHttp,
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement,
    private readonly adaptateurHorloge: AdaptateurHorloge
  ) {
    this.enteteJSON = {
      headers: {
        'api-key': this.adaptateurEnvironnement.brevo().cléAPI(),
        accept: 'application/json',
        'content-type': 'application/json',
      },
    };
  }

  private readonly récupèreContact = async (email: string): Promise<DonnéesUtilisateurBrevo> => {
    try {
      const { data } = await this.clientHttp.get<DonnéesUtilisateurBrevo>(
        `${this.adaptateurEnvironnement.brevo().url()}/contacts/${email}`,
        this.enteteJSON
      );

      return data;
    } catch (erreur: unknown) {
      if (isAxiosError(erreur)) {
        throw new Error(`Erreur lors de la récupération d\`un contact sur Brévo : ${erreur.message}`, {
          cause: erreur,
        });
      }
      throw erreur;
    }
  };

  private readonly envoieÉvénement = async ({
    email,
    propriétésÀMettreÀJour,
    nomÉvénement,
    messageErreur,
  }: ÉvénementBrevo & { messageErreur: string }) => {
    try {
      const corpsDeRequête = {
        event_name: nomÉvénement,
        identifiers: { email_id: email },
        ...(propriétésÀMettreÀJour && { contact_properties: propriétésÀMettreÀJour }),
      };
      await this.clientHttp.post(
        `${this.adaptateurEnvironnement.brevo().url()}/events`,
        corpsDeRequête,
        this.enteteJSON
      );
    } catch (erreur: unknown) {
      if (isAxiosError(erreur)) {
        throw new Error(messageErreur + erreur.message, { cause: erreur });
      }
      throw erreur;
    }
  };

  envoieEmailBienvenue = async ({ email, prenom }: { email: string; prenom: string }) => {
    await this.clientHttp.post(
      `${this.adaptateurEnvironnement.brevo().url()}/smtp/email`,
      {
        to: [{ email }],
        templateId: parseInt(process.env.BREVO_ID_TEMPLATE_BIENVENUE || '0'),
        PRENOM: decode(prenom),
      },
      this.enteteJSON
    );
  };

  creeContactBrevo = async ({
    email,
    prenom,
    nom,
    infoLettre,
    pixelDeSuiviAccepté,
    telephone,
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
    pixelDeSuiviAccepté: boolean;
    telephone?: string;
  }) => {
    try {
      await this.clientHttp.post(
        `${this.adaptateurEnvironnement.brevo().url()}/contacts`,
        {
          updateEnabled: true,
          email,
          emailBlacklisted: !infoLettre,
          attributes: {
            PRENOM: decode(prenom),
            NOM: decode(nom),
            SMS: new Telephone(telephone).auFormatInternational(),
            _PIXEL_TRACKING_CONSENT: pixelDeSuiviAccepté,
          },
        },
        this.enteteJSON
      );
    } catch (erreur: Error | unknown) {
      if (isAxiosError(erreur)) {
        if (erreur.response?.data.message === 'Contact already exist') return Promise.resolve();

        console.error(erreur.message, {
          'Erreur renvoyée par API Brevo': erreur.response?.data,
        });
        return Promise.reject(erreur);
      }
    }
  };

  inscrisAInfolettre = async (email: string) => {
    try {
      await this.clientHttp.post(
        `${this.adaptateurEnvironnement.brevo().url()}/contacts`,
        {
          updateEnabled: true,
          email,
          emailBlacklisted: false,
          listIds: [Number(process.env.BREVO_ID_LISTE_ATTENTE_INFOLETTRE || '-1')].filter((i) => i != -1),
        },
        this.enteteJSON
      );
    } catch (erreur: Error | unknown) {
      if (isAxiosError(erreur)) {
        if (erreur.response?.data.message === 'Contact already exist') {
          return undefined;
        }
        console.error(erreur.message, { 'Erreur renvoyée par API Brevo': erreur.response?.data });
        throw erreur;
      }
    }
  };

  metsÀJourMesureConsultée = async (événement: MesureConsultee) => {
    await this.envoieÉvénement({
      email: événement.email,
      nomÉvénement: 'mesure_consultee',
      propriétésÀMettreÀJour: { DATE_DERNIERE_CONSULTATION_MESURE: this.adaptateurHorloge.maintenant() },
      messageErreur: "Erreur lors de la mise à jour d'une mesure consultée sur Brévo : ",
    });
  };

  metsÀJourMesurePriseEnCompte = async (événement: MesurePriseEnCompte) => {
    const donnéesUtilisateur = await this.récupèreContact(événement.email);

    await this.envoieÉvénement({
      email: événement.email,
      nomÉvénement: 'mesure_prise_en_compte',
      propriétésÀMettreÀJour: {
        DATE_DERNIERE_PRISE_EN_COMPTE_MESURE: this.adaptateurHorloge.maintenant(),
        NOMBRE_MESURES_PRISES_EN_COMPTE: (donnéesUtilisateur.attributes.NOMBRE_MESURES_PRISES_EN_COMPTE ?? 0) + 1,
      },
      messageErreur: "Erreur lors de la mise à jour d'une mesure prise en compte sur Brévo : ",
    });
  };

  metsÀJourModuleTerminé = async (événement: ModuleTermine) => {
    const donnéesUtilisateur = await this.récupèreContact(événement.email);

    await this.envoieÉvénement({
      email: événement.email,
      nomÉvénement: 'module_termine',
      propriétésÀMettreÀJour: {
        DATE_DERNIERE_COMPLETION_MODULE: this.adaptateurHorloge.maintenant(),
        NOMBRE_MODULES_TERMINES: (donnéesUtilisateur.attributes.NOMBRE_MODULES_TERMINES ?? 0) + 1,
      },
      messageErreur: "Erreur lors de la mise à jour d'une complétion de module sur Brévo : ",
    });
  };

  metsÀJourBadgeCyberdépartDébloqué = async (événement: BadgeCyberdépartDébloqué) => {
    await this.envoieÉvénement({
      email: événement.email,
      nomÉvénement: 'badge_cyberdepart_debloque',
      propriétésÀMettreÀJour: { DATE_DEBLOCAGE_BADGE_CYBERDEPART: this.adaptateurHorloge.maintenant() },
      messageErreur: 'Erreur lors de la mise à jour du déblocage du badge CyberDépart sur Brévo : ',
    });
  };

  metsÀJourParcoursChangé = async (événement: ParcoursChangé) => {
    await this.envoieÉvénement({
      email: événement.email,
      nomÉvénement: 'parcours_change',
      propriétésÀMettreÀJour: { PARCOURS: événement.parcours },
      messageErreur: 'Erreur lors de la mise à jour du parcours sur Brévo : ',
    });
  };

  metsÀJourParcoursRejoint = async (événement: ParcoursRejoint) => {
    await this.envoieÉvénement({
      email: événement.email,
      nomÉvénement: 'parcours_rejoint',
      propriétésÀMettreÀJour: { PARCOURS: événement.parcours },
      messageErreur: 'Erreur lors de la mise à jour du parcours sur Brévo : ',
    });
  };

  metsÀJourParcoursAllégéTerminé = async (événement: ParcoursAllégéTerminé) => {
    await this.envoieÉvénement({
      email: événement.email,
      nomÉvénement: 'parcours_allege_termine',
      messageErreur: 'Erreur lors de la mise à jour de la complétion du parcours allégé sur Brévo : ',
    });
  };

  metsÀJourParcoursCompletTerminé = async (événement: ParcoursCompletTerminé) => {
    await this.envoieÉvénement({
      email: événement.email,
      nomÉvénement: 'parcours_complet_termine',
      messageErreur: 'Erreur lors de la mise à jour de la complétion du parcours complet sur Brévo : ',
    });
  };
}

export const adaptateurEmailBrevo = ({
  clientHttp,
  adaptateurEnvironnement,
  adaptateurHorloge,
}: {
  clientHttp: ClientHttp;
  adaptateurEnvironnement: AdaptateurEnvironnement;
  adaptateurHorloge: AdaptateurHorloge;
}): AdaptateurEmail => new AdaptateurEmailBrevo(clientHttp, adaptateurEnvironnement, adaptateurHorloge);

export const fabriqueAdaptateurEmail = (
  adaptateurEnvironnement: AdaptateurEnvironnement,
  adaptateurHorloge: AdaptateurHorloge
) =>
  adaptateurEnvironnement.brevo().url() && adaptateurEnvironnement.brevo().cléAPI()
    ? new AdaptateurEmailBrevo(axiosSécurisé, adaptateurEnvironnement, adaptateurHorloge)
    : adaptateurEmailConsole();
