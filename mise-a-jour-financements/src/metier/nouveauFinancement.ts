import { Financement } from './financement';

export type NouveauFinancement = {
  idFinancement: Financement['id'];
  nom: Financement['nom'];
  url: string;
};
