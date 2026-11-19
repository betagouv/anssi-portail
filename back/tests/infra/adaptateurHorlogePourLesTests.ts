import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';

const estUneDate = (représentationIso: string) => /^\d{4}-\d{2}-\d{2}$/.test(représentationIso);

const fabriqueMaintenant = (représentationIso?: string): (() => Temporal.Instant) => {
  if (!représentationIso) return () => Temporal.Now.instant();

  if (estUneDate(représentationIso)) {
    return () => Temporal.PlainDate.from(représentationIso).toZonedDateTime(Temporal.Now.timeZoneId()).toInstant();
  }

  return () => Temporal.Instant.from(représentationIso);
};

export const fabriqueAdaptateurHorloge = (représentationIso?: string): AdaptateurHorloge => {
  const maintenant = fabriqueMaintenant(représentationIso);

  return {
    maintenant,
    maintenantZoné: () => maintenant().toZonedDateTimeISO(Temporal.Now.timeZoneId()),
  };
};
