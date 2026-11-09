import type { Rule } from 'eslint';
import { meta } from './espaces-insecables-ponctuation-francaise/commun.js';
import { analyserSvelte } from './espaces-insecables-ponctuation-francaise/svelte.js';

const règle: Rule.RuleModule = {
  meta,
  create(context) {
    return analyserSvelte(context);
  },
};

export default règle;
