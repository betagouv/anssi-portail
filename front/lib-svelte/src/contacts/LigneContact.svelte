<script lang="ts">
  import Lien from '../ui/Lien.svelte';

  type Props = {
    type: 'adresse' | 'email' | 'nom' | 'site-web' | 'telephone';
    valeur: string;
    libelle?: string;
  };

  const { type, valeur, libelle = valeur }: Props = $props();
</script>

<p class={type}>
  {#if type === 'email'}
    <Lien href="mailto:{valeur}" {libelle}></Lien>
  {:else if type === 'telephone'}
    <Lien href="tel:{valeur}" {libelle}></Lien>
  {:else if type === 'site-web'}
    <Lien href={valeur} {libelle} blank></Lien>
  {:else}
    {valeur}
  {/if}
</p>

<style lang="scss">
  p {
    margin: 0;
    line-height: 1.5rem;
    display: flex;
    gap: 8px;
    align-items: start;

    &:before {
      width: 16px;
      height: 16px;
      display: block;
      padding: 4px 0 3px 0;
    }

    &.telephone:before {
      content: url('/assets/images/icone-contact-telephone.svg');
    }

    &.email:before {
      content: url('/assets/images/icone-contact-email.svg');
    }

    &.nom:before {
      content: url('/assets/images/icone-contact-nom.svg');
    }

    &.site-web:before {
      content: url('/assets/images/icone-contact-site-web.svg');
    }

    &.adresse:before {
      content: url('/assets/images/icone-contact-adresse.svg');
    }
  }
</style>
