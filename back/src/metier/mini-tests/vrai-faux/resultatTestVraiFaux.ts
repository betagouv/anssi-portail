import { v7 as uuidv7 } from 'uuid';
import { Utilisateur } from '../../utilisateur.js';

export class RésultatTestVraiFaux {
  public readonly id: string;
  public readonly utilisateur: Utilisateur;
  public readonly score: string;

  constructor({ utilisateur, score }: { utilisateur: Utilisateur; score: string }) {
    this.id = uuidv7();
    this.utilisateur = utilisateur;
    this.score = score;
  }
}
