<script lang="ts">
  interface Props {
    recherche: string;
  }

  let { recherche = $bindable() }: Props = $props();

  const requete = $derived(recherche);

  const valide = (evenement: CustomEvent) => (recherche = evenement.detail);
</script>

<dsfr-search placeholder="Rechercher" value={requete} buttonType="button" onsearch={valide}></dsfr-search>

<style lang="scss">
  dsfr-search {
    margin-bottom: 16px;
  }
</style>
