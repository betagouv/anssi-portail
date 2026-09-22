import { ValeursSecteursActivites, ValeursSecteursComposites } from './SecteurActivite.valeurs.js';
import type { UnionDe } from './UnionDe.js';

export type SecteurActivite = UnionDe<typeof ValeursSecteursActivites>;

export type SecteurComposite = UnionDe<typeof ValeursSecteursComposites>;

export type SecteurSimple = Exclude<SecteurActivite, SecteurComposite>;
