export interface AdaptateurEmail {
  envoieEmailBienvenue: ({ email, prenom }: { email: string; prenom: string; }) => Promise<void>;
}
