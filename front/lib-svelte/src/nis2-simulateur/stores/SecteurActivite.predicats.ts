import type {
  SecteurActivite,
  SecteurComposite,
} from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.definitions';
import { ValeursSecteursComposites } from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.valeurs';
import type { Activite } from '../../../../../back/src/metier/nis2-simulateur/Activite.definitions';
import { contientUnParmi } from '../../../../../back/src/metier/nis2-simulateur/commun.predicats';

export const estUnSecteurAvecDesSousSecteurs = (
  secteur: string
): secteur is SecteurComposite =>
  ValeursSecteursComposites.includes(secteur as SecteurComposite);

export const estSecteurAutre = (secteur: SecteurActivite) =>
  secteur.startsWith('autre');

export const doitPasserParLocalisationFournitureServicesNumeriques = (
  activites: Activite[],
) =>
  contientUnParmi(
    "fournisseurReseauxCommunicationElectroniquesPublics",
    "fournisseurServiceCommunicationElectroniquesPublics",
  )(activites);

export const doitPasserParLocalisationEtablissementPrincipal = (
  secteurs: SecteurActivite[],
  activites: Activite[],
) => {
  const ticOuFournisseurNumerique = contientUnParmi(
    "gestionServicesTic",
    "fournisseursNumeriques",
  )(secteurs);

  const activiteFournisseurServiceNumerique = contientUnParmi(
    "registresNomsDomainesPremierNiveau",
    "fournisseurServicesDNS",
    "fournisseurServicesInformatiqueNuage",
    "fournisseurServiceCentresDonnees",
    "fournisseurReseauxDiffusionContenu",
    "fournisseurServicesEnregristrementNomDomaine",
  )(activites);

  return ticOuFournisseurNumerique || activiteFournisseurServiceNumerique;
};