export const aseptiseListeGrist = (liste: string[] | null): string[] => {
  return liste?.filter((item) => item !== 'L') ?? [];
};
