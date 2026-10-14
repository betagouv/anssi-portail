import axios from 'axios';
import { hydrate } from 'svelte';
import Contacts from './contacts/Contacts.svelte';
import { estCodeRegion, type ContactsInitiaux } from './contacts/contacts.type';

// Les props doivent être identiques à celles du prérendu serveur pour que l'hydratation conserve le HTML existant.
const chargeContactsInitiaux = async (): Promise<ContactsInitiaux | undefined> => {
  try {
    return (await axios.get<ContactsInitiaux>('/api/contacts')).data;
  } catch {
    return undefined;
  }
};

const [idRegion = ''] = window.location.pathname.split('/').filter(Boolean).slice(1);
const codeRegion = idRegion.toUpperCase();

hydrate(Contacts, {
  target: document.getElementById('contacts')!,
  props: {
    contactsInitiaux: await chargeContactsInitiaux(),
    regionInitiale: estCodeRegion(codeRegion) ? codeRegion : '',
  },
});
