import { MiniTest } from '../../metier/mini-tests/mini-test.js';

export type Retour = 'POSITIF' | 'NEGATIF';

export class RetourMiniTestDonné {
  miniTest: MiniTest;
  commentaire?: string;
  retour: Retour;

  constructor({ miniTest, commentaire, retour }: { miniTest: MiniTest; commentaire?: string; retour: Retour }) {
    this.miniTest = miniTest;
    this.retour = retour;
    this.commentaire = commentaire;
  }
}
