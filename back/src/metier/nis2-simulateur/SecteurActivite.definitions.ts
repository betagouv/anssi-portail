import type { UnionDe } from './UnionDe.js';
import { ValeursSecteursActivites, ValeursSecteursComposites } from './SecteurActivite.valeurs.js';

export type SecteurActivite = UnionDe<typeof ValeursSecteursActivites>;

export type SecteurComposite = UnionDe<typeof ValeursSecteursComposites>;

export type SecteurSimple = Exclude<SecteurActivite, SecteurComposite>;
