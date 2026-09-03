import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneQuestionnaireVraiFauxReponseSoumiseDansJournal } from '../../src/bus/consigneQuestionnaireVraiFauxReponseSoumiseDansJournal.js';
import { QuestionnaireVraiFauxRéponseSoumise } from '../../src/bus/evenements/questionnaireVraiFauxReponseSoumise.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe('L’abonnement qui consigne une réponse à une question vraie/faux dans le journal', () => {
  it('consigne un évènement QuestionnaireVraiFauxRéponseSoumise pour un utilisateur identifié', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneQuestionnaireVraiFauxReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new QuestionnaireVraiFauxRéponseSoumise({
        idCorrélation: 'id-correlation',
        idQuestion: 'q1',
        réponseCorrecte: true,
        email: 'u1@example.com',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      })
    );

    assert.deepEqual(evenementRecu, {
      type: 'QUESTIONNAIRE_VRAI_FAUX_REPONSE_SOUMISE',
      donnees: {
        idCorrélation: 'id-correlation',
        idQuestion: 'q1',
        réponseCorrecte: true,
        idUtilisateur: 'u1@example.com-hacheHMAC',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      },
      date: new Date('2025-03-10'),
    });
  });

  it('consigne un évènement QuestionnaireVraiFauxRéponseSoumise pour un utilisateur anonyme', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneQuestionnaireVraiFauxReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new QuestionnaireVraiFauxRéponseSoumise({
        idCorrélation: 'id-correlation',
        idQuestion: 'q1',
        réponseCorrecte: false,
      })
    );

    assert.deepEqual(evenementRecu, {
      type: 'QUESTIONNAIRE_VRAI_FAUX_REPONSE_SOUMISE',
      donnees: {
        idCorrélation: 'id-correlation',
        idQuestion: 'q1',
        réponseCorrecte: false,
      },
      date: new Date('2025-03-10'),
    });
  });
});
