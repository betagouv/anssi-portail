<script lang="ts">
  import type { Component, Snippet } from 'svelte';

  import CarteContact from './CarteContact.svelte';
  import type { ContactsRegionaux } from './contacts.type';
  import LigneContact from './LigneContact.svelte';

  type Props = {
    contact: NonNullable<ContactsRegionaux['campus']>;
    modèle?: Component<{ titre: string; children: Snippet }>;
  };
  const { contact, modèle: ModèleCarteContact = CarteContact }: Props = $props();
</script>

<ModèleCarteContact titre={contact.nom}>
  {#if contact.email}
    <LigneContact type="email" valeur={contact.email} />
  {/if}
  <LigneContact type="site-web" valeur={contact.siteWeb} />
  <LigneContact type="adresse" valeur={contact.adresse} />
</ModèleCarteContact>
