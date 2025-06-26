export type RetourExperience = {
  raison: string;
  precision?: string;
  emailDeContact?: string;
};

export interface MessagerieInstantanee {
  notifieUnRetourExperience(retourExperience: RetourExperience): Promise<void>;
}
