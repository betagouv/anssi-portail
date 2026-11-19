import { v7 as uuidv7 } from 'uuid';
import { Utilisateur } from '../../utilisateur.js';

export type DonnéesCréationRésultatTest = {
  id?: string;
  dateRealisation?: Date;
  utilisateur?: Utilisateur;
};

export abstract class RésultatTest {
  id: string;
  dateRealisation: Date;
  utilisateur?: Utilisateur;

  constructor({ id, dateRealisation, utilisateur }: DonnéesCréationRésultatTest) {
    this.id = id ?? uuidv7();
    this.dateRealisation = dateRealisation ?? new Date();
    this.utilisateur = utilisateur;
  }
}
