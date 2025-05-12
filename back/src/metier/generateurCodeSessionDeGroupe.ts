import { EntrepotSessionDeGroupe } from './entrepotSessionDeGroupe';

export interface GenerateurCodeSessionDeGroupe {
  genere: () => Promise<string>;
}

export class GenerateurAleatoireCodeSessionDeGroupe
  implements GenerateurCodeSessionDeGroupe
{
  constructor(private entrepotSessionDeGroupe: EntrepotSessionDeGroupe) {}

  genere = async () => {
    let code = '';
    let codeDisponible = false;
    while (!codeDisponible) {
      code = this.genereCode();
      codeDisponible = !(await this.entrepotSessionDeGroupe.parCode(code));
    }

    return code;
  };

  private genereCode() {
    let resultat = '';
    const lettres = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    for (let i = 0; i < 6; i++) {
      const number = Math.floor(Math.random() * lettres.length);
      resultat = resultat + lettres[number];
    }
    return resultat;
  }
}
