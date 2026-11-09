import type { Rule } from 'eslint';
import { meta } from './espaces-insecables-ponctuation-francaise/commun.js';
import { analyserHtml } from './espaces-insecables-ponctuation-francaise/html.js';
import { analyserSvelte } from './espaces-insecables-ponctuation-francaise/svelte.js';

const règle: Rule.RuleModule = {
  meta,
  create(context) {
    return /\.(?:html|md)$/.test(context.filename) ? analyserHtml(context) : analyserSvelte(context);
  },
};

export default règle;
