import { Request, Response, Router } from 'express';
import { Financement } from '../metier/financement';
import { estCodeRegion } from '../metier/referentielRegions';
import { trancheEffectifParCode } from '../metier/referentielTranchesEffectifEtablissement';
import { ConfigurationServeur } from './configurationServeur';

const construitFiltreFinancementParRegion = (codeRegion?: string) => {
  if (!estCodeRegion(codeRegion)) {
    return () => true;
  }
  return (financement: Financement): boolean =>
    financement.regions.includes('FRANCE') ||
    financement.regions.includes(codeRegion);
};

const construitFiltreFinancementParEntite = ({
  estAssociation,
  estCollectivite,
  codeTrancheEffectif,
}: {
  estAssociation: boolean;
  estCollectivite: boolean;
  codeTrancheEffectif?: string;
}) => {
  if (estCollectivite) {
    return (financement: Financement): boolean =>
      financement.entitesElligibles.includes('Collectivités');
  }
  if (estAssociation) {
    return (financement: Financement): boolean =>
      financement.entitesElligibles.includes('Associations');
  }
  const trancheEffectif = trancheEffectifParCode(codeTrancheEffectif);
  if (trancheEffectif.code !== 'NN') {
    const codeEffectifNombre = Number(trancheEffectif.code);
    if (codeEffectifNombre < 12) {
      return (financement: Financement): boolean =>
        financement.entitesElligibles.includes('TPE');
    }
    if (codeEffectifNombre < 32) {
      return (financement: Financement): boolean =>
        financement.entitesElligibles.includes('PME');
    }
    if (codeEffectifNombre < 52) {
      return (financement: Financement): boolean =>
        financement.entitesElligibles.includes('ETI');
    }
    return (financement: Financement): boolean =>
      financement.entitesElligibles.includes('Entreprises');
  }
  return () => true;
};

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

          financements = financements
            .filter(
              construitFiltreFinancementParEntite({
                estAssociation,
                estCollectivite,
                codeTrancheEffectif,
              })
            )
            .filter(construitFiltreFinancementParRegion(codeRegion));
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
