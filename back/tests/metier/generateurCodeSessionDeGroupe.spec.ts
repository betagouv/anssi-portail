import { beforeEach, describe, it, expect } from 'vitest';
import { GenerateurAleatoireCodeSessionDeGroupe } from '../../src/metier/generateurCodeSessionDeGroupe.js';
import { EntrepotSessionDeGroupeMemoire } from '../persistance/EntrepotSessionDeGroupeMemoire.js';
import { SessionDeGroupe } from '../../src/metier/sessionDeGroupe.js';

describe('Le générateur aléatoire de code de session de groupe', () => {
  let generateur: GenerateurAleatoireCodeSessionDeGroupe;
  let entrepotSessionsDeGroupe: EntrepotSessionDeGroupeMemoire;

  beforeEach(() => {
    entrepotSessionsDeGroupe = new EntrepotSessionDeGroupeMemoire();
    generateur = new GenerateurAleatoireCodeSessionDeGroupe(entrepotSessionsDeGroupe);
  });

  it('génère un code de 6 caractères', async () => {
    const code = await generateur.genere();

    expect(code).toHaveLength(6);
  });

  it('contient uniquement des chiffres ou des lettres majuscules', async () => {
    const code = await generateur.genere();

    expect(code).toMatch(/[A-Z0-9]{6}/);
  });

  it('est toujours différent', async () => {
    for (let i = 0; i < 50; i++) {
      const code1 = await generateur.genere();
      const code2 = await generateur.genere();

      expect(code1).not.toBe(code2);
    }
  });

  it('ne contient pas de 0 (chiffre) ni de O (lettre), car ces caractères peuvent être confondus', async () => {
    for (let i = 0; i < 500; i++) {
      const code = await generateur.genere();

      expect(code.includes('0')).toBe(false);
      expect(code.includes('O')).toBe(false);
    }
  });

  it('ne génère pas de code qui a déjà été affecté', async () => {
    let essai = 0;
    let aTireUnCodeExistant: boolean = false;
    let codeInexistantDansLEntrepot: string = '';
    entrepotSessionsDeGroupe.parCode = async (code: string): Promise<SessionDeGroupe | undefined> => {
      if (essai === 0) {
        aTireUnCodeExistant = true;
        essai++;
        return SessionDeGroupe.cree({ genere: async () => code });
      }
      codeInexistantDansLEntrepot = code;
      return undefined;
    };

    const code = await generateur.genere();

    expect(aTireUnCodeExistant).toBeTruthy();
    expect(code).toBe(codeInexistantDansLEntrepot);
  });
});
