import { calculeCodeSecteurContact } from '@anssi-portail/contacts-sectoriels';
import { describe, expect, it } from 'vitest';

describe("Le secteur de contact est retrouvé pour un code d'activité NAF 2025", () => {
  it('est indéfini pour une activité non gérée', () => {
    const codeSecteur = calculeCodeSecteurContact('01.11Y');

    expect(codeSecteur).toBeUndefined();
  });

  it("est indéfini quand le code d'activité est absent", () => {
    expect(calculeCodeSecteurContact(undefined)).toBeUndefined();
  });

  describe('concernant le secteur Aviation', () => {
    it('pour la classe des transports spatiaux', () => {
      const codeSecteur = calculeCodeSecteurContact('51.22Y');

      expect(codeSecteur).toBe('aviation');
    });

    it('pour toute la division', () => {
      const codeSecteur = calculeCodeSecteurContact('51.10Y');

      expect(codeSecteur).toBe('aviation');
    });
  });

  describe('concernant le secteur Entreprise Défense', () => {
    it("pour la sous-classe de fabrication d'armes et de munitions", () => {
      const codeSecteur = calculeCodeSecteurContact('25.30Y');

      expect(codeSecteur).toBe('defense');
    });

    it('pour la classe de défense de l’administration publique', () => {
      const codeSecteur = calculeCodeSecteurContact('84.22Y');

      expect(codeSecteur).toBe('defense');
    });
  });

  describe('concernant le secteur Santé', () => {
    it('pour la division des activités de santé humaine', () => {
      expect(calculeCodeSecteurContact('86.23Y')).toBe('sante');
      expect(calculeCodeSecteurContact('86.94G')).toBe('sante');
    });

    it("pour la division des services d'administration publique (tutelle) de la santé, de la formation, de la culture et des services sociaux, autre que sécurité sociale", () => {
      expect(calculeCodeSecteurContact('84.12Y')).toBe('sante');
      expect(calculeCodeSecteurContact('84.11Y')).toBeUndefined();
    });
  });

  describe('concernant le secteur Social', () => {
    it('pour la division de la gestion des retraites complémentaires', () => {
      expect(calculeCodeSecteurContact('84.30H')).toBe('social');
    });
  });

  describe('concernant le secteur Maritime', () => {
    it('pour la division des transports par eau', () => {
      const codeSecteur = calculeCodeSecteurContact('50.10Y');

      expect(codeSecteur).toBe('maritime');
    });

    it("pour la division de l'entreposage et services auxiliaires des transports", () => {
      expect(calculeCodeSecteurContact('52.21Y')).toBeUndefined();
      expect(calculeCodeSecteurContact('52.22Y')).toBe('maritime');
      expect(calculeCodeSecteurContact('52.24G')).toBe('maritime');
      expect(calculeCodeSecteurContact('52.24H')).toBeUndefined();
      expect(calculeCodeSecteurContact('52.26Y')).toBeUndefined();
    });

    it('pour la division Génie civil', () => {
      expect(calculeCodeSecteurContact('42.11Y')).toBeUndefined();
      expect(calculeCodeSecteurContact('42.91Y')).toBe('maritime');
      expect(calculeCodeSecteurContact('42.99Y')).toBeUndefined();
    });

    it('pour la division Activités de location et location-bail', () => {
      expect(calculeCodeSecteurContact('77.34Y')).toBe('maritime');
      expect(calculeCodeSecteurContact('77.33Y')).toBeUndefined();
    });
  });

  describe('concernant le secteur Enseignement et recherche', () => {
    it('pour la division Enseignement', () => {
      expect(calculeCodeSecteurContact('85.10Y')).toBe('enseignement-recherche');
    });

    it('pour la division Recherche-développement scientifique', () => {
      expect(calculeCodeSecteurContact('72.10G')).toBe('enseignement-recherche');
      expect(calculeCodeSecteurContact('72.10H')).toBe('enseignement-recherche');
      expect(calculeCodeSecteurContact('72.20Y')).toBeUndefined();
    });
  });
});

describe("Le secteur de contact n'est pas retrouvé", () => {
  it("pour un code d'activité invalide", () => {
    expect(calculeCodeSecteurContact('toto')).toBeUndefined();
    expect(calculeCodeSecteurContact('72.10g')).toBeUndefined();
    expect(calculeCodeSecteurContact('7210G')).toBeUndefined();
  });

  it("pour un ancien code d'activité NAF rév. 2 dont la sous-classe a changé", () => {
    expect(calculeCodeSecteurContact('25.40Z')).toBeUndefined();
    expect(calculeCodeSecteurContact('52.24A')).toBeUndefined();
  });
});
