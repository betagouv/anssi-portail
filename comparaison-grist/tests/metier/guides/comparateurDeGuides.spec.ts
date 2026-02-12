import { beforeEach, describe, expect, it } from 'vitest';
import {
  EntrepotGuideGrist,
  RetourGuideGrist,
} from '../../../src/infrastructure/entrepotGuideGrist';
import { ClientHttp } from '../../../src/metier/clientHttp';
import { ComparateurDeGuides } from '../../../src/metier/guides/comparateurDeGuides';
import { ConstructeurGuideGrist } from './constructeurGuideGrist';

describe('Le comparateur de guides', () => {
  let clientHttpSource: ClientHttp<RetourGuideGrist>;
  let clientHttpCible: ClientHttp<RetourGuideGrist>;
  let comparateurDeGuides: ComparateurDeGuides;

  beforeEach(() => {
    clientHttpSource = {
      get: async () => {
        return {
          data: {
            records: [],
          },
        };
      },
    };
    clientHttpCible = {
      get: async () => {
        return {
          data: {
            records: [],
          },
        };
      },
    };
    comparateurDeGuides = new ComparateurDeGuides(
      new EntrepotGuideGrist(clientHttpSource, 'http://localhost', ''),
      new EntrepotGuideGrist(clientHttpCible, 'http://localhost', '')
    );
  });

  it('sait charger les données sources et cibles', async () => {
    const guide1 = new ConstructeurGuideGrist()
      .avecLeNumeroDeLigne(1)
      .avecLIdentifiant('guide1')
      .construis();
    const guide2 = new ConstructeurGuideGrist()
      .avecLeNumeroDeLigne(2)
      .avecLIdentifiant('guide2')
      .construis();

    clientHttpSource.get = async () => {
      return {
        data: {
          records: [guide1],
        },
      };
    };

    clientHttpCible.get = async () => {
      return {
        data: {
          records: [guide2],
        },
      };
    };

    await comparateurDeGuides.chargeLesDonnees();

    expect(comparateurDeGuides.guidesSource).toHaveLength(1);
    expect(comparateurDeGuides.guidesSource[0].id).toEqual(
      guide1.fields.Identifiant
    );
    expect(comparateurDeGuides.guidesCible).toHaveLength(1);
    expect(comparateurDeGuides.guidesCible[0].id).toEqual(
      guide2.fields.Identifiant
    );
  });
});
