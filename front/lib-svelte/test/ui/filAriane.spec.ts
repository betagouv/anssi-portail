import { beforeEach, describe, expect, it } from 'vitest';
import type { Mesure } from '../../src/parcours-securisation/mesure';
import { fabriqueFilAriane, type PropriétésFilAriane } from '../../src/ui/filAriane';

describe('La fabrique du fil d’Ariane', () => {
  describe('avec 3 segments max (legacy)', () => {
    let propriétésFilAriane: PropriétésFilAriane;
    beforeEach(() => {
      propriétésFilAriane = {
        feuille: 'Feuille',
        branche: {
          nom: 'Branche',
          lien: '/branche',
        },
        brancheConnectée: {
          nom: 'Branche connectée',
          lien: '/branche-connectee',
        },
      };
    });

    describe("fabrique un fil d'Ariane en mode non connectée", () => {
      it('le segment "accueil" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, false);

        expect(filAriane[0]).toEqual({ id: 'noeud-accueil', label: 'Accueil', href: '/' });
      });

      it('le segment "branche non connectée" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, false);

        expect(filAriane[1]).toEqual({ id: 'noeud-Branche', label: 'Branche', href: '/branche' });
      });

      it('le segment "feuille" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, false);

        expect(filAriane[2]).toEqual({ id: 'noeud-Feuille', label: 'Feuille', href: '' });
      });
    });

    describe("fabrique un fil d'Ariane en mode connectée", () => {
      it('le segment "catalogue" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, true);

        expect(filAriane[0]).toEqual({ id: 'noeud-catalogue', label: 'Guides et ressources', href: '/catalogue' });
      });

      it('le segment "branche connectée" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, true);

        expect(filAriane[1]).toEqual({
          id: 'noeud-Branche connectée',
          label: 'Branche connectée',
          href: '/branche-connectee',
        });
      });

      it('le segment "feuille" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, true);

        expect(filAriane[2]).toEqual({ id: 'noeud-Feuille', label: 'Feuille', href: '' });
      });

      it('le segment "branche non connectée" est présent si aucune information "connecté" n\'est fourni', () => {
        propriétésFilAriane = {
          feuille: 'Feuille',
          branche: {
            nom: 'Branche non connectée',
            lien: '/branche-non-connectee',
          },
        };

        const filAriane = fabriqueFilAriane(propriétésFilAriane, true);

        expect(filAriane[1]).toEqual({
          id: 'noeud-Branche non connectée',
          label: 'Branche non connectée',
          href: '/branche-non-connectee',
        });
      });
    });
  });

  describe('avec plus de 3 segments', () => {
    let propriétésFilAriane: PropriétésFilAriane;
    beforeEach(() => {
      propriétésFilAriane = [
        {
          défaut: {
            nom: 'Branche parent',
            lien: '/branche-1',
          },
          connecté: {
            nom: 'Branche parent connectée',
            lien: '/branche-connectee-1',
          },
        },
        {
          défaut: {
            nom: 'Branche enfant',
            lien: '/branche-enfant-1',
          },
          connecté: {
            nom: 'Branche enfant connectée',
            lien: '/branche-enfant-connectee-1',
          },
        },
        {
          nom: 'Feuille',
        },
      ];
    });

    describe("fabrique un fil d'Ariane en mode non connecté", () => {
      it('le segment "accueil" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, false);

        expect(filAriane[0]).toEqual({ id: 'noeud-accueil', label: 'Accueil', href: '/' });
      });

      it('le segment "branche parent" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, false);

        expect(filAriane[1]).toEqual({ id: 'noeud-Branche parent', label: 'Branche parent', href: '/branche-1' });
      });

      it('le segment "branche enfant" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, false);

        expect(filAriane[2]).toEqual({
          id: 'noeud-Branche enfant',
          label: 'Branche enfant',
          href: '/branche-enfant-1',
        });
      });
    });

    describe("fabrique un fil d'Ariane en mode connecté", () => {
      it('le segment "catalogue" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, true);

        expect(filAriane[0]).toEqual({ id: 'noeud-catalogue', label: 'Guides et ressources', href: '/catalogue' });
      });

      it('le segment "branche parent connectée"  est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, true);

        expect(filAriane[1]).toEqual({
          id: 'noeud-Branche parent connectée',
          label: 'Branche parent connectée',
          href: '/branche-connectee-1',
        });
      });

      it('le segment "branche enfant connectée" est présent', () => {
        const filAriane = fabriqueFilAriane(propriétésFilAriane, true);

        expect(filAriane[2]).toEqual({
          id: 'noeud-Branche enfant connectée',
          label: 'Branche enfant connectée',
          href: '/branche-enfant-connectee-1',
        });
      });

      it('le segment "branche enfant défaut" est présent', () => {
        propriétésFilAriane = [
          {
            défaut: {
              nom: 'Branche parent',
              lien: '/branche-1',
            },
            connecté: {
              nom: 'Branche parent connectée',
              lien: '/branche-connectee-1',
            },
          },
          {
            défaut: {
              nom: 'Branche enfant',
              lien: '/branche-enfant-1',
            },
          },
          {
            nom: 'Feuille',
          },
        ];

        const filAriane = fabriqueFilAriane(propriétésFilAriane, true);

        expect(filAriane[2]).toEqual({
          id: 'noeud-Branche enfant',
          label: 'Branche enfant',
          href: '/branche-enfant-1',
        });
      });
    });

    describe('cas spécifique des mesures du parcours de sécurisation', () => {
      const propriétésFilAriane = (mesure: Mesure) => [
        {
          nom: 'Protéger mon organisation',
          lien: mesure.idModule === 1 ? `/modules/${mesure.idModule}` : '/parcours-complet',
        },
        ...(mesure.idModule === 1
          ? [] // pas de sous-branche pour le module 1
          : [
              {
                nom: mesure.nomModule,
                lien: `/modules/${mesure.idModule}`,
              },
            ]),
        {
          nom: mesure.titre,
        },
      ];

      describe('pour une mesure du module 1 "Prendre son Cyberdépart"', () => {
        const mesure = {
          id: 'AUTH.5',
          titre: 'Activer la vérification en deux étapes ou un aut...',
          phraseAccroche: 'Empêchez qu’un compte soit utilisé, même si le mot de passe a fuité 💨',
          explications: '<p>Un mot de passe seul ne suffit pas toujours à protéger un...',
          actionPrioritaire: '<p>Mettre en oeuvre la vérification en deux étapes sur les...',
          actionFacileAFaire: 'Dans les principales suites collaboratives (La Suite Numérique...',
          ordre: 10,
          risques: [],
          liens: [],
          exigences: [],
          idModule: 1,
          nomModule: 'Prendre son cyberdépart',
          tutoriels: [],
          estPriseEnCompte: true,
        };

        it("le second segment est 'Protéger mon organisation' et non le nom du module", () => {
          const filAriane = fabriqueFilAriane(propriétésFilAriane(mesure), true);

          expect(filAriane[1]).toEqual({
            id: 'noeud-Protéger mon organisation',
            label: 'Protéger mon organisation',
            href: '/modules/1',
          });
        });
      });
    });
  });
});
