<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import CarteContact from './CarteContact.svelte';
  import type { ContactSectoriel } from './contacts.type';
  import LigneContact from './LigneContact.svelte';

  type Props = {
    contact: ContactSectoriel;
    modèle?: Component<{ titre: string; children: Snippet }>;
  };
  const { contact, modèle: ModèleCarteContact = CarteContact }: Props = $props();
</script>

<ModèleCarteContact titre={contact.nom}>
  <LigneContact type="site-web" valeur={contact.siteWeb} />

  {#if contact.téléphone}
    <LigneContact type="telephone" valeur={contact.téléphone} />
  {/if}
</ModèleCarteContact>
