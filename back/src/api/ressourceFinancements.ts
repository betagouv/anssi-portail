import { Request, Response, Router } from 'express';
import { estCodeRegion } from '../metier/referentielRegions';
import { trancheEffectifParCode } from '../metier/referentielTranchesEffectifEtablissement';
import { ConfigurationServeur } from './configurationServeur';

export const ressourceFinancements = ({
  entrepotFinancement,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  adaptateurRechercheEntreprise,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.ajouteUtilisateurARequete(
      entrepotUtilisateur,
      adaptateurHachage
    ),
    async (requete: Request, reponse: Response) => {
      try {
        let financements = await entrepotFinancement.tous();

        if (requete.utilisateur) {
          const resultatRechercheOrga =
            await adaptateurRechercheEntreprise.rechercheOrganisations(
              requete.utilisateur.siretEntite,
              null
            );
          const {
            codeRegion,
            codeTrancheEffectif,
            estCollectivite,
            estAssociation,
          } = resultatRechercheOrga[0];
          if (estCodeRegion(codeRegion)) {
            financements = financements.filter(
              (f) =>
                f.regions.includes('FRANCE') || f.regions.includes(codeRegion)
            );
          }
          if (estCollectivite) {
            financements = financements.filter((f) =>
              f.entitesElligibles.includes('Collectivités')
            );
          } else if (estAssociation) {
            financements = financements.filter((f) =>
              f.entitesElligibles.includes('Associations')
            );
          } else {
            const trancheEffectif = trancheEffectifParCode(codeTrancheEffectif);
            if (trancheEffectif.code !== 'NN') {
              const codeEffectifNombre = Number(trancheEffectif.code);
              let entite = '';
              if (codeEffectifNombre < 12) {
                entite = 'TPE';
              } else if (codeEffectifNombre < 32) {
                entite = 'PME';
              } else if (codeEffectifNombre < 52) {
                entite = 'ETI';
              } else {
                entite = 'Entreprises';
              }
              if (entite) {
                financements = financements.filter((f) =>
                  f.entitesElligibles.includes(entite)
                );
              }
            }
          }
        }
        reponse.send(
          financements.map((financement) => ({
            id: financement.id,
            nom: financement.nom,
            financeur: financement.financeur,
            typesDeFinancement: financement.typesDeFinancement,
            entitesElligibles: financement.entitesElligibles,
            perimetresGeographiques: financement.perimetresGeographiques,
            regions: financement.regions,
          }))
        );
      } catch {
        reponse.sendStatus(500);
      }
    }
  );
  return routeur;
};
