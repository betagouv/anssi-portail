import { Financement } from './financement';

export type DifferenceFinancement = {
  idFinancement: Financement['id'];
  donneesDifferentes?: {
    nomDeLaDonnee: keyof Omit<Financement, 'id'>;
    valeurSurGrist: string;
    nouvelleValeur: string;
  };
  etat?: 'supprimé';
};
