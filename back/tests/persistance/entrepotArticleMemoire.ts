import { EntrepôtArticle } from '../../src/metier/blog/entrepotArticle.js';
import { RésuméArticle } from '../../src/metier/blog/resumeArticle.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepôtArticleMémoire extends EntrepotMemoire<RésuméArticle> implements EntrepôtArticle {}
