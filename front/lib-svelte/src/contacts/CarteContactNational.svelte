<script lang="ts">
  import Lien from '../ui/Lien.svelte';
  import CarteContact from './CarteContact.svelte';
  import type { ContactNational } from './contacts.type';
  import LigneContact from './LigneContact.svelte';

  type Props = {
    contact: ContactNational;
  };
  const { contact }: Props = $props();
</script>

<CarteContact titre={contact.nom}>
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
</CarteContact>

<style lang="scss">
  p {
    margin: 0;
    line-height: 1.5rem;
  }
</style>
