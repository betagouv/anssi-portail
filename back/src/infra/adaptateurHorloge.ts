export type AdaptateurHorloge = {
  maintenant: () => Temporal.Instant;
  maintenantZoné: () => Temporal.ZonedDateTime;
};

export const adaptateurHorloge: AdaptateurHorloge = {
  maintenant: () => Temporal.Now.instant(),
  maintenantZoné: () => Temporal.Now.instant().toZonedDateTimeISO(Temporal.Now.timeZoneId()),
};
