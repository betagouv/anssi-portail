import type { AppartenancePaysUnionEuropeenne } from '../../../../../back/src/metier/nis2-simulateur/ChampsSimulateur.definitions';
import { contientUnParmi } from '../../../../../back/src/metier/nis2-simulateur/commun.predicats';

export const optionFrance = (contexte: string) => ({
  label: 'France',
  name: `radios-${contexte}`,
  id: `radio-${contexte}-fr`,
  value: 'france',
});

export const optionAutre = (contexte: string) => ({
  label: "Autres états membres de l'Union Européenne",
  name: `radios-${contexte}`,
  id: `radio-${contexte}-autre`,
  value: 'autre',
});
export const optionHorsUe = (contexte: string) => ({
  label: 'Autres états hors Union Européenne',
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

  const decisionEnFranceOuUE = contientUnParmi(paysDecision)([
    'france',
    'autre',
  ]);

  const decisionHorsUE = paysDecision === 'horsue';
  const operationEnFranceOuUE = contientUnParmi(paysOperation)([
    'france',
    'autre',
  ]);

  const operationHorsUE = paysOperation === 'horsue';
  const paysSalariesRepondu = paysSalaries !== undefined;

  return (
    decisionEnFranceOuUE ||
    (decisionHorsUE && operationEnFranceOuUE) ||
    (operationHorsUE && paysSalariesRepondu)
  );
}
