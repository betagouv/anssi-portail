import { writable } from 'svelte/store';
import type { MailHameçonnage } from './hameconnage';

export const mailOuvert = writable<MailHameçonnage | undefined>();
export const tousLesMails = writable<MailHameçonnage[]>();
