import {
  ValeursActivitesConstructionVehiculesAutomobiles,
  ValeursActivitesEauPotable,
  ValeursActivitesEauUsees,
  ValeursActivitesElectricite,
  ValeursActivitesEspace,
  ValeursActivitesFabricationAutresMaterielTransports,
  ValeursActivitesFabricationDispositifsMedicaux,
  ValeursActivitesFabricationEquipementsElectroniques,
  ValeursActivitesFabricationMachinesEquipements,
  ValeursActivitesFabricationProductionDistributionProduitsChimiques,
  ValeursActivitesFabricationProduitsInformatiquesElectroniquesOptiques,
  ValeursActivitesFournisseursNumeriques,
  ValeursActivitesGaz,
  ValeursActivitesGestionDechets,
  ValeursActivitesGestionServicesTic,
  ValeursActivitesHydrogene,
  ValeursActivitesInfrastructureMarcheFinancier,
  ValeursActivitesInfrastructureNumerique,
  ValeursActivitesPetrole,
  ValeursActivitesProductionTransformationDistributionDenreesAlimentaires,
  ValeursActivitesRecherche,
  ValeursActivitesReseauxChaleurFroid,
  ValeursActivitesSante,
  ValeursActivitesSecteurBancaire,
  ValeursActivitesServicesPostauxExpedition,
  ValeursActivitesTransportsAeriens,
  ValeursActivitesTransportsFerroviaires,
  ValeursActivitesTransportsParEau,
  ValeursActivitesTransportsRoutiers,
} from './Activite.valeurs.js';

type ActivitesElectricite = (typeof ValeursActivitesElectricite)[number];
type ActivitesReseauxChaleurFroid = (typeof ValeursActivitesReseauxChaleurFroid)[number];
type ActivitesPetrole = (typeof ValeursActivitesPetrole)[number];
type ActivitesGaz = (typeof ValeursActivitesGaz)[number];
type ActivitesHydrogene = (typeof ValeursActivitesHydrogene)[number];
type ActivitesEnergie =
  ActivitesElectricite | ActivitesReseauxChaleurFroid | ActivitesPetrole | ActivitesGaz | ActivitesHydrogene;
type ActivitesTransportsAeriens = (typeof ValeursActivitesTransportsAeriens)[number];
type ActivitesTransportsFerroviaires = (typeof ValeursActivitesTransportsFerroviaires)[number];
type ActivitesTransportsParEau = (typeof ValeursActivitesTransportsParEau)[number];
type ActivitesTransportsRoutiers = (typeof ValeursActivitesTransportsRoutiers)[number];
type ActivitesTransports =
  | ActivitesTransportsAeriens
  | ActivitesTransportsFerroviaires
  | ActivitesTransportsParEau
  | ActivitesTransportsRoutiers;
type ActivitesSecteurBancaire = (typeof ValeursActivitesSecteurBancaire)[number];
type ActivitesInfrastructureMarcheFinancier = (typeof ValeursActivitesInfrastructureMarcheFinancier)[number];
type ActivitesSante = (typeof ValeursActivitesSante)[number];
type ActivitesEauPotable = (typeof ValeursActivitesEauPotable)[number];
type ActivitesEauUsees = (typeof ValeursActivitesEauUsees)[number];
type ActivitesInfrastructureNumerique = (typeof ValeursActivitesInfrastructureNumerique)[number];
type ActivitesGestionServicesTic = (typeof ValeursActivitesGestionServicesTic)[number];
type ActivitesEspace = (typeof ValeursActivitesEspace)[number];
type ActivitesServicesPostauxExpedition = (typeof ValeursActivitesServicesPostauxExpedition)[number];
type ActivitesGestionDechets = (typeof ValeursActivitesGestionDechets)[number];
type ActivitesFabricationProductionDistributionProduitsChimiques =
  (typeof ValeursActivitesFabricationProductionDistributionProduitsChimiques)[number];
type ActivitesProductionTransformationDistributionDenreesAlimentaires =
  (typeof ValeursActivitesProductionTransformationDistributionDenreesAlimentaires)[number];
type ActivitesFabricationDispositifsMedicaux = (typeof ValeursActivitesFabricationDispositifsMedicaux)[number];
type ActivitesFabricationProduitsInformatiquesElectroniquesOptiques =
  (typeof ValeursActivitesFabricationProduitsInformatiquesElectroniquesOptiques)[number];
type ActivitesFabricationEquipementsElectroniques =
  (typeof ValeursActivitesFabricationEquipementsElectroniques)[number];
type ActivitesFabricationMachinesEquipements = (typeof ValeursActivitesFabricationMachinesEquipements)[number];
type ActivitesConstructionVehiculesAutomobiles = (typeof ValeursActivitesConstructionVehiculesAutomobiles)[number];
type ActivitesFabricationAutresMaterielTransports =
  (typeof ValeursActivitesFabricationAutresMaterielTransports)[number];
type ActivitesFabrication =
  | ActivitesFabricationDispositifsMedicaux
  | ActivitesFabricationProduitsInformatiquesElectroniquesOptiques
  | ActivitesFabricationEquipementsElectroniques
  | ActivitesFabricationMachinesEquipements
  | ActivitesConstructionVehiculesAutomobiles
  | ActivitesFabricationAutresMaterielTransports;
type ActivitesFournisseursNumeriques = (typeof ValeursActivitesFournisseursNumeriques)[number];
type ActivitesRecherche = (typeof ValeursActivitesRecherche)[number];
export type Activite =
  // Annexe 1
  | ActivitesEnergie
  | ActivitesTransports
  | ActivitesSecteurBancaire
  | ActivitesInfrastructureMarcheFinancier
  | ActivitesSante
  | ActivitesEauPotable
  | ActivitesEauUsees
  | ActivitesInfrastructureNumerique
  | ActivitesGestionServicesTic
  | ActivitesEspace
  // Annexe 2
  | ActivitesServicesPostauxExpedition
  | ActivitesGestionDechets
  | ActivitesFabricationProductionDistributionProduitsChimiques
  | ActivitesProductionTransformationDistributionDenreesAlimentaires
  | ActivitesFabrication
  | ActivitesFournisseursNumeriques
  | ActivitesRecherche;

export type DescriptionActivite = {
  titre: string;
  description: string;
};
