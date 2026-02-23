import axios from 'axios';
import { EntrepotExigence } from '../metier/EntrepotExigence';
import { CategorieEntite, Exigence } from '../metier/Exigence';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { ClientHttp } from './clientHttp';
import { EntrepotGrist, ReponseGrist } from './entrepotGrist';
import { aseptiseListeGrist } from './grist';

export type ExigenceGrist = {
  id: number;
  fields: {
    References_New_: string[];
    Objectif_de_securite: string;
    Thematique: string;
    Contenu: string;
    EIEE: string[];
  };
};

export class EntrepotExigenceGrist
  extends EntrepotGrist<ExigenceGrist>
  implements EntrepotExigence
{
  constructor({
    clientHttp = axios,
    adaptateurEnvironnement,
  }: {
    clientHttp?: ClientHttp<ReponseGrist<ExigenceGrist>>;
    adaptateurEnvironnement: AdaptateurEnvironnement;
  }) {
    super(
      clientHttp,
      adaptateurEnvironnement.grist().urlExigencesNis2(),
      adaptateurEnvironnement.grist().cleApiExigencesNis2(),
      5
    );
  }

  async parReferentiel(_referentiel: string): Promise<Exigence[]> {
    const exigences = await this.appelleGrist();

    return exigences.records.map(
      (exigenceGrist) =>
        new Exigence({
          reference: aseptiseListeGrist(exigenceGrist.fields.References_New_)[0],
          contenu: exigenceGrist.fields.Contenu,
          thematique: exigenceGrist.fields.Thematique,
          entitesCible: aseptiseListeGrist(exigenceGrist.fields.EIEE)
            .map(
              (categorie) =>
                ({ EI: 'EntiteImportante', EE: 'EntiteEssentielle' })[
                  categorie
                ] as CategorieEntite
            )
            .filter((c) => c !== undefined),
          objectifSecurite: exigenceGrist.fields.Objectif_de_securite,
        })
    );
  }
}
