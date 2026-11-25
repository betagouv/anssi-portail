import type { ContexteMSC } from '../contexte.js';

declare global {
  namespace App {
    // SvelteKit fusionne cette interface avec App.Locals.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Locals extends ContexteMSC {}
    interface PageData {
      seo?: { titre: string; nom: string; service?: string; description?: string };
    }
  }
}
export {};
