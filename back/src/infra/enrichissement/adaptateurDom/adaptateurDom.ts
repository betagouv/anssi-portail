import { JSDOM } from 'jsdom';

export interface AdaptateurDom {
  adapte(dom: JSDOM, routeDemandée: string): void | Promise<void>;
}
