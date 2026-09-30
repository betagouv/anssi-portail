import { EntrepôtArticle } from '../../src/metier/blog/entrepotArticle.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepôtArticleMémoire extends EntrepotMemoire<{ slug: string }> implements EntrepôtArticle {}
