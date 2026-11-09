import type { AppartenancePaysUnionEuropeenne } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';
import { contientUnParmi } from '../../../../../back/src/metier/nis2-simulateur/commun.predicats';

export const optionFrance = (contexte: string) => ({
  label: 'France',
  name: `radios-${contexte}`,
  id: `radio-${contexte}-fr`,
  value: 'france',
});

export const optionAutre = (contexte: string) => ({
  label: "Autres États membres de l'Union européenne",
  name: `radios-${contexte}`,
  id: `radio-${contexte}-autre`,
  value: 'autre',
});
export const optionHorsUe = (contexte: string) => ({
  label: 'Autres États hors Union européenne',
  name: `radios-${contexte}`,
  id: `radio-${contexte}-horsue`,
  value: 'horsue',
});

export function reponseEstComplete(reponse: {
  paysDecision?: AppartenancePaysUnionEuropeenne;
  paysOperation?: AppartenancePaysUnionEuropeenne;
  paysSalaries?: AppartenancePaysUnionEuropeenne;
}) {
  const { paysDecision, paysOperation, paysSalaries } = reponse;

  const decisionEnFranceOuUE = contientUnParmi(paysDecision)(['france', 'autre']);

  const decisionHorsUE = paysDecision === 'horsue';
  const operationEnFranceOuUE = contientUnParmi(paysOperation)(['france', 'autre']);

  const operationHorsUE = paysOperation === 'horsue';
  const paysSalariesRepondu = paysSalaries !== undefined;

  return decisionEnFranceOuUE || (decisionHorsUE && operationEnFranceOuUE) || (operationHorsUE && paysSalariesRepondu);
}
