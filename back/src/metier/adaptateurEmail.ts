export interface AdaptateurEmail {
  envoieEmailBienvenue: ({
    email,
    prenom,
  }: {
    email: string;
    prenom: string;
  }) => Promise<void>;
  creeContactBrevo: ({
    email,
    prenom,
    nom,
    infoLettre,
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
  }) => Promise<void>;
}
