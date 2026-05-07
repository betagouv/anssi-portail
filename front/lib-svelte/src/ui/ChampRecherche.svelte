<script lang="ts">
  export let recherche: string;
  let requete: string;

  $: requete = recherche;

  const valide = (evenement: CustomEvent) => (recherche = evenement.detail);
</script>

<dsfr-search placeholder="Rechercher" value={requete} buttonType="button" onsearch={valide}></dsfr-search>

<style lang="scss">
  dsfr-search {
    margin-bottom: 16px;
  }
</style>
