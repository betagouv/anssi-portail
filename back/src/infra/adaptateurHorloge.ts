export type AdaptateurHorloge = {
  maintenant: () => Date;
};

export const adaptateurHorloge = {
  maintenant: () => new Date(),
};
