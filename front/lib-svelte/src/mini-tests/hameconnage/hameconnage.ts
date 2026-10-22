export type MailHameçonnage = {
  id: string;
  expediteur: {
    nom: string;
    mail: string;
  };
  destinataire: string;
  objet: string;
  heuresMinutesRéception: string;
  estLu: boolean;
  réponseUtilisateur?: 'bonne' | 'mauvaise';
};
