export interface AdaptateurEmail {
  envoieEmailBienvenue: ({ email, prenom }: { email: string; prenom: string }) => Promise<void>;
  creeContactBrevo: ({
    email,
    prenom,
    nom,
    infoLettre,
    pixelDeSuiviAccepté,
    telephone,
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
    pixelDeSuiviAccepté: boolean;
    telephone?: string;
  }) => Promise<void>;
  inscrisAInfolettre: (email: string) => Promise<void>;
}
