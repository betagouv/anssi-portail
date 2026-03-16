<script lang="ts">
  import { clic } from '../directives/actions.svelte';
  import Modale from '../ui/Modale.svelte';

  type Props = {
    estBureau: boolean;
  };
  const { estBureau }: Props = $props();
  let detailsReCyFOuvert = $state<boolean>(false);
</script>

{#if !estBureau}
  <dsfr-alert type="info" size="sm" hasTitle={false}>
    <p slot="description" class="contenu">
      Cette page n’est pas optimisée pour un affichage mobile.
    </p>
  </dsfr-alert>
{/if}

<dsfr-alert type="info" size="sm" hasTitle={false} dismissible>
  <p slot="description" class="contenu">
    Le présent outil de comparaison de référentiels est mis à disposition par
    l’Agence nationale de la sécurité des systèmes d'information (ci-après,
    l’Agence) à titre purement informatif et indicatif, afin de faciliter la
    compréhension par l’écosystème du référentiel NIS 2 qu’elle a élaboré. <dsfr-link
      label="Afficher la suite"
      href="#exigences"
      use:clic={() => {
        detailsReCyFOuvert = true;
      }}
    ></dsfr-link>
  </p>
</dsfr-alert>
{#if detailsReCyFOuvert}
  <Modale bind:estOuverte={detailsReCyFOuvert}>
    <h4>Exigences applicables à NIS&nbsp;2</h4>
    <p>
      Le présent outil de comparaison de référentiels est mis à disposition par
      l’Agence nationale de la sécurité des systèmes d'information (ci-après,
      l’Agence) à titre purement informatif et indicatif, afin de faciliter la
      compréhension par l’écosystème du référentiel NIS 2 qu’elle a élaboré. Les
      correspondances et les analyses complémentaires qu’il présente ne
      sauraient être interprétées comme des prescriptions à l’égard des entités
      qui souhaiteraient s’y référer et ne constituent pas une position
      officielle de l’Agence quant à la conformité d’une entité aux exigences
      référencées qui relève de la seule appréciation et responsabilité de
      l’entité qui l’utilise.
    </p>
    <p>
      Il ne constitue en aucun cas une décision d’équivalence en application de
      l’article 15 du projet de loi relative à la résilience des infrastructures
      critiques et au renforcement de la cybersécurité actuellement en
      discussion au Parlement.
    </p>
    <p>
      Les résultats présentés ne sauraient lier l’appréciation qui pourrait être
      portée par l’Agence dans l’exercice de ses missions auprès des entités,
      notamment dans le cadre de son activité de supervision et de contrôle.
    </p>
    {#snippet actions()}
      <dsfr-button
        label="J'ai compris"
        use:clic={() => {
          detailsReCyFOuvert = false;
        }}
      ></dsfr-button>
    {/snippet}
  </Modale>
{/if}

<style lang="scss">
  dsfr-alert {
    margin-bottom: 1.5rem;
  }

  .contenu {
    margin: 0px 0 4px;
  }

  dsfr-button {
    align-self: flex-end;
  }
</style>
