import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceMesMiniTests = ({
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  entrepôtRésultatTestMaturité,
  entrepôtRésultatTestVraiFaux,
  entrepôtRésultatTestExposition,
  entrepôtRésultatTestRéflexesCyber,
  entrepôtRésultatTestHameçonnage,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    async (requête, réponse) => {
      const résultatTestMaturité = await entrepôtRésultatTestMaturité.dernierPourUtilisateur(requête.utilisateur);
      const résultatTestVraiFaux = await entrepôtRésultatTestVraiFaux.dernierPourUtilisateur(requête.utilisateur);
      const résultatTestExposition = await entrepôtRésultatTestExposition.dernierPourUtilisateur(requête.utilisateur);
      const résultatTestHameçonnage = await entrepôtRésultatTestHameçonnage.dernierPourUtilisateur(requête.utilisateur);
      const résultatTestRéflexesCyber = await entrepôtRésultatTestRéflexesCyber.dernierPourUtilisateur(
        requête.utilisateur
      );
      réponse.send({
        maturité: { réalisé: résultatTestMaturité !== undefined },
        vraiFaux: { réalisé: résultatTestVraiFaux !== undefined },
        exposition: { réalisé: résultatTestExposition !== undefined },
        hameçonnage: { réalisé: résultatTestHameçonnage !== undefined },
        réflexesCyber: { réalisé: résultatTestRéflexesCyber !== undefined },
      });
    }
  );

  return routeur;
};
