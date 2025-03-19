import { mount } from 'svelte';
import Contacts from './contacts/Contacts.svelte';

const contacts = mount(Contacts, {
  target: document.getElementById('contacts')!,
});

export default contacts;
