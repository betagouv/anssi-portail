import { describe, expect, it } from 'vitest';
import { calculeCodeSecteurContact } from '../../src/contacts/contacts';

describe("Le secteur de contact est retrouvé pour un code d'activité", () => {
  it('est indéfini pour une activité non gérée', () => {
    const codeSecteur = calculeCodeSecteurContact('01.11Z');

    expect(codeSecteur).toBe(undefined);
  });

  describe('concernant le secteur Aviation', () => {
    it('pour la classe des transports spatiaux', () => {
      const codeSecteur = calculeCodeSecteurContact('51.22Z');

      expect(codeSecteur).toBe('aviation');
    });

    it('pour toute la division', () => {
      const codeSecteur = calculeCodeSecteurContact('51.10Z');

      expect(codeSecteur).toBe('aviation');
    });
  });

  describe('concernant le secteur Entreprise Défense', () => {
    it("pour la sous-classe de fabrication d'armes et de munitions", () => {
      const codeSecteur = calculeCodeSecteurContact('25.40Z');

      expect(codeSecteur).toBe('defense');
    });

    it('pour la classe de défense de l’administration publique', () => {
      const codeSecteur = calculeCodeSecteurContact('84.22Z');

      expect(codeSecteur).toBe('defense');
    });
  });

  describe('concernant le secteur Santé', () => {
    it('pour la division des activités de santé humaine', () => {
      expect(calculeCodeSecteurContact('86.23Z')).toBe('sante');
      expect(calculeCodeSecteurContact('86.90F')).toBe('sante');
    });

    it("pour la division des services d'administration publique et de défense ; services de sécurité sociale obligatoire", () => {
      expect(calculeCodeSecteurContact('84.12Z')).toBe('sante');
      expect(calculeCodeSecteurContact('84.30B')).toBe('sante');
      expect(calculeCodeSecteurContact('84.11Z')).toBe(undefined);
    });
  });

  describe('concernant le secteur Maritime', () => {
    it('pour la division des transports par eau', () => {
      const codeSecteur = calculeCodeSecteurContact('50.10Z');

      expect(codeSecteur).toBe('maritime');
    });

    it("pour la division de l'entreposage et services auxiliaires des transports", () => {
      expect(calculeCodeSecteurContact('52.10A')).toBe(undefined);
      expect(calculeCodeSecteurContact('52.22Z')).toBe('maritime');
      expect(calculeCodeSecteurContact('52.24A')).toBe('maritime');
      expect(calculeCodeSecteurContact('52.24B')).toBe(undefined);
    });

    it('pour la division Génie civil', () => {
      expect(calculeCodeSecteurContact('42.11Z')).toBe(undefined);
      expect(calculeCodeSecteurContact('42.91Z')).toBe('maritime');
      expect(calculeCodeSecteurContact('42.99Z')).toBe(undefined);
    });

    it('pour la division Activités de location et location-bail', () => {
      expect(calculeCodeSecteurContact('77.34Z')).toBe('maritime');
      expect(calculeCodeSecteurContact('77.33Z')).toBe(undefined);
    });
  });

  describe('concernant le secteur Enseignement et recherche', () => {
    it('pour la division Enseignement', () => {
      expect(calculeCodeSecteurContact('85.10Z')).toBe(
        'enseignement-recherche'
      );
    });

    it('pour la division Recherche-développement scientifique', () => {
      expect(calculeCodeSecteurContact('72.11Z')).toBe(
        'enseignement-recherche'
      );
      expect(calculeCodeSecteurContact('72.19Z')).toBe(
        'enseignement-recherche'
      );
      expect(calculeCodeSecteurContact('72.20Z')).toBe(undefined);
    });
  });
});
