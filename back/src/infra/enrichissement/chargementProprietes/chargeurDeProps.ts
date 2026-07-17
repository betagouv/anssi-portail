import { JSDOM } from 'jsdom';

export interface ChargeurDeProps {
  charge(dom: JSDOM, routeDemandée: string): Promise<Record<string, unknown> | undefined>;
}
