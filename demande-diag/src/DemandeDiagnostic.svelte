<svelte:options
  customElement={{
    tag: 'lab-anssi-demande-diagnostic',
    shadow: 'none',
    props: {
      siretAidant: { type: 'String', attribute: 'siret-aidant' },
    },
  }}
/>

<script lang="ts">
  import DemandeDiagnosticSimplifiee from '@anssi-portail/svelte/src/demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';

  const { siretAidant }: { siretAidant?: string } = $props();
</script>

<div class="lab-anssi-demande-diagnostic-simplifiee" data-themeable>
  <DemandeDiagnosticSimplifiee
    origine={window.location.hostname}
    urlBase={import.meta.env.VITE_API_URL}
    cacheLesLiensDeRetour={true}
    {siretAidant}
  ></DemandeDiagnosticSimplifiee>
</div>

<style lang="scss">
  .lab-anssi-demande-diagnostic-simplifiee {
    font-family: Marianne, Arial, sans-serif;
    font-size: 16px;
    font-weight: normal;

    --noir: #000000;
    --jaune-msc: #fed980;
    --jaune-msc-hover: #ecca79;
    --jaune-msc-clique: #ddbd70;
    --jaune-clair-msc: #fff7db;

    --bouton-arrondi: 8px;
    --bouton-primaire-couleur-texte: #0d0c21;
    --bouton-primaire-couleur-fond: #fed980;
    --bouton-primaire-couleur-fond-survol: #ecca79;
    --bouton-primaire-couleur-fond-clique: #ddbd70;

    --erreur-texte: #ce0500;

    :global .demande-diagnostic {
      @media (min-width: 767px) {
        padding: 40px;
      }

      @media (min-width: 992px) {
        grid-template-areas:
          'explications formulaire'
          'faq faq';
      }
    }
  }
</style>
