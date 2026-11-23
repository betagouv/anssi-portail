import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceMesMiniTests = ({
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  entrepôtRésultatTestMaturité,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    async (_requête, réponse) => {
      const résultatTestMaturité = await entrepôtRésultatTestMaturité.dernierPourUtilisateur(_requête.utilisateur);
      réponse.send({
        maturité: {
          réalisé: résultatTestMaturité !== undefined,
        },
      });
    }
  );

  return routeur;
};
