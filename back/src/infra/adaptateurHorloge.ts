export type AdaptateurHorloge = {
  maintenant: () => Temporal.Instant;
};

export const adaptateurHorloge: AdaptateurHorloge = {
  maintenant: () => Temporal.Now.instant(),
};
