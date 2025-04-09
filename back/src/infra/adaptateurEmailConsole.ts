import { AdaptateurEmail } from '../metier/adaptateurEmail';

export const adaptateurEmailConsole = (): AdaptateurEmail => ({
  envoieEmailBienvenue: async ({
    email,
    prenom,
  }: {
    email: string;
    prenom: string;
  }) => {
    console.log(
      `Envoie d'email de bienvenue pour l'utilisateur ${email} avec prénom ${prenom}`
    );
  },
  creeContactBrevo: async () => {},
});
