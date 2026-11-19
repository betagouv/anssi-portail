import { createEventsAsync, EventAttributes } from 'ics';
import { AdaptateurHorloge } from '../../../infra/adaptateurHorloge.js';
import { RappelAnnuel } from '../../../metier/outils/rappelAnnuel.js';

export const génèreRappelIcs = async (rappel: RappelAnnuel, adaptateurHorloge: AdaptateurHorloge): Promise<string> => {
  const { début, fin } = rappel.créneau(adaptateurHorloge);

  const configurationÉvènement: EventAttributes = {
    start: début,
    end: fin,
    title: rappel.titre,
    description: rappel.description,
    productId: '-//ANSSI//NONSGML MesServicesCyber//FR',
    recurrenceRule: 'FREQ=YEARLY',
    alarms: [
      {
        action: 'display',
        trigger: { hours: 0, minutes: 0, before: true },
        description: rappel.descriptionAlarme,
      },
    ],
  };
  const évènement = await createEventsAsync([configurationÉvènement]);
  return évènement.value as string;
};
