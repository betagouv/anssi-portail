<script lang="ts">
  import CarteContact from './CarteContact.svelte';
  import type { ContactSectoriel } from './contacts.type';
  import LigneContact from './LigneContact.svelte';

  type Props = {
    contact: ContactSectoriel;
  };
  const { contact }: Props = $props();
</script>

<CarteContact titre={contact.nom}>
  <LigneContact type="site-web" valeur={contact.siteWeb} />

  {#if contact.téléphone}
    <LigneContact type="telephone" valeur={contact.téléphone} />
  {/if}
</CarteContact>
