<script lang="ts">
  import CarteContact from './CarteContact.svelte';
  import type { ContactsRegionaux } from './contacts.type';
  import LigneContact from './LigneContact.svelte';

  type Props = {
    contact: NonNullable<ContactsRegionaux['campus']>;
  };
  const { contact }: Props = $props();
</script>

<CarteContact titre={contact.nom}>
  {#if contact.email}
    <LigneContact type="email" valeur={contact.email} />
  {/if}
  <LigneContact type="site-web" valeur={contact.siteWeb} />
  <LigneContact type="adresse" valeur={contact.adresse} />
</CarteContact>
