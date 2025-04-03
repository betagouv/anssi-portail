import { mount } from 'svelte';
import Contacts from './contacts/Contacts.svelte';

mount(Contacts, {
  target: document.getElementById('contacts')!,
});
