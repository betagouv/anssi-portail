<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import Lien from '@ui/Lien.svelte';
  import CarteContact from './CarteContact.svelte';
  import type { ContactNational } from './contacts.type';
  import LigneContact from './LigneContact.svelte';

  type Props = {
    contact: ContactNational;
    modèle?: Component<{ titre: string; children: Snippet }>;
  };
  const { contact, modèle: ModèleCarteContact = CarteContact }: Props = $props();
</script>

<ModèleCarteContact titre={contact.nom}>
  <p>{contact.description}</p>
  {#if contact.contacts}
    <div>
      <p>{contact.contacts.introduction}</p>
      <ul>
        {#each contact.contacts.liens as { libelle, href } (href)}
          <li><Lien {href} {libelle} blank></Lien></li>
        {/each}
      </ul>
    </div>
  {/if}
  <LigneContact type="site-web" valeur={contact.lienPrincipal.href} libelle={contact.lienPrincipal.libelle} />
  {#if contact.email}
    <LigneContact type="email" valeur={contact.email} />
  {/if}
  {#if contact.téléphone}
    <LigneContact type="telephone" valeur={contact.téléphone} />
  {/if}
</ModèleCarteContact>

<style lang="scss">
  p {
    margin: 0;
    line-height: 1.5rem;
  }
</style>
