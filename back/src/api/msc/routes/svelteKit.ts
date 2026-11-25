import { fileURLToPath } from 'node:url';
import type { ContexteMSC } from '@anssi-portail/msc/contexte';
import pages from '@anssi-portail/msc/pages.json' with { type: 'json' };
import express, { type Express, type RequestHandler } from 'express';
import type { Utilisateur } from '../../../metier/utilisateur.js';
import { sessionAuthentifiée } from '../../adaptateurJWT.js';
import type { ConfigurationServeur } from '../../configurationServeur.js';
import { previsionMaintenance } from '../../ressourceInfosSite.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

const délègue: RequestHandler = async (req, res, next) => {
  const { handler } = await import('@anssi-portail/msc/handler');
  handler(req, res, next);
};

export const enregistreLesAssetsKit = (app: Express) => {
  const chemin = fileURLToPath(new URL('./client/_app', import.meta.resolve('@anssi-portail/msc/handler')));
  app.use(
    '/_app',
    express.static(chemin, {
      setHeaders: (res) => res.setHeader('Cache-Control', process.env.CACHE_CONTROL_FICHIERS_STATIQUES || 'no-store'),
    })
  );
};

export const enregistreSvelteKit = (app: Express, configuration: ConfigurationServeur) => {
  const chemins = Object.keys(pages).map((page) => '/' + page);
  const chargeUtilisateur = configuration.middleware.ajouteUtilisateurARequete(
    configuration.entrepotUtilisateur,
    configuration.adaptateurHachage
  );
  app.get(
    [...chemins, ...chemins.map((chemin) => chemin + '/__data.json')],
    valideCorpsRequete(corpsVide),
    (req, res, next) =>
      sessionAuthentifiée(req.session?.token, configuration.adaptateurJWT) ? chargeUtilisateur(req, res, next) : next(),
    async (req, res, next) => {
      const chemin = req.path.replace(/\/+$/u, '');
      if (req.path !== chemin) return res.redirect(308, chemin + req.originalUrl.slice(req.path.length));
      const utilisateur = req.utilisateur as Utilisateur | undefined;
      const contexte: ContexteMSC = {
        profil: utilisateur && {
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          estAgentAnssi: await utilisateur.estAgentAnssi(),
          codeActivite: (await utilisateur.organisation()).codeActivite,
          codeRegion: await utilisateur.codeRegion(),
          parcoursSecurisation: { parcoursActuel: utilisateur.parcoursActuel() },
        },
        maintenance: previsionMaintenance(configuration.adaptateurEnvironnement),
        rapporteur: configuration.rapporteur,
        politiqueDeSécurité: String(res.getHeader('content-security-policy') ?? ''),
      };
      Object.assign(req, { msc: contexte });
      next();
    },
    délègue
  );
};
