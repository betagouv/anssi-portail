<script lang="ts">
  import type { Component, Snippet } from 'svelte';

  import CarteContact from './CarteContact.svelte';
  import type { ContactsRegionaux } from './contacts.type';
  import LigneContact from './LigneContact.svelte';

  type Props = {
    contact: NonNullable<ContactsRegionaux['COT']>;
    désignation: ContactsRegionaux['designation'];
    modèle?: Component<{ titre: string; children: Snippet }>;
  };
  const { contact, désignation, modèle: ModèleCarteContact = CarteContact }: Props = $props();
</script>

<ModèleCarteContact titre="Délégué(e)s ANSSI de votre {désignation}">
  <LigneContact type="nom" valeur={contact.nom} />
  <LigneContact type="email" valeur={contact.email} />
</ModèleCarteContact>
