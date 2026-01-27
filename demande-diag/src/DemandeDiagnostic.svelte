<svelte:options
  customElement={{
    tag: 'lab-anssi-demande-diagnostic-simplifiee',
    shadow: 'none',
    props: {
      origine: { attribute: 'origine', type: 'String' },
    },
  }}
/>

<script lang="ts">
  import DemandeDiagnosticSimplifiee from '@anssi-portail/svelte/src/demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  type Props = {
    origine: string;
  };
  const { origine } = $$props as Props;
</script>

<div class="lab-anssi-demande-diagnostic-simplifiee">
  <DemandeDiagnosticSimplifiee
    {origine}
    urlBase="https://lab-anssi-msc-demo.cleverapps.io"
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
