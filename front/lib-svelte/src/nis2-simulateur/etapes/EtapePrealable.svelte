<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import Etape from './Etape.svelte';

  interface Props {
    onsuivant: () => void;
  }

  let props: Props = $props();
</script>

<Etape>
  <h2>Pour bien débuter</h2>
  <div class="description">
    <div>
      <p>
        Ce test permet de cerner si votre entité sera concernée par la directive
        NIS 2, et ce dès 2024. Nous le tiendrons à jour au fil des précisions
        apportées par la transposition en droit français.
      </p>
      <p>
        <b>
          Si votre entité appartient à un groupe d'entreprises aux activités
          variées, ce test peut être réalisé pour chaque entreprise filiale, ou
          pour le groupe si celui-ci mène une activité économique.
        </b>
      </p>
    </div>
    <div>
      <img src="/assets/images/localisation-france.svg" alt="" />
    </div>
  </div>
  <dsfr-highlight
    text="Cet outil est un simulateur qui permet d'obtenir une estimation du
          statut d'une entité, conformément aux textes actuellement en vigueur. Ce service ne permet pas de s'acquitter de la future obligation d'enregistrement
          qui incomberont aux entités concernées par la directive NIS&nbsp;2 en France."
  ></dsfr-highlight>

  <dsfr-highlight
    text="Il est préférable d'associer des compétences juridiques à la démarche
      d'auto-évaluation du statut de l'entité afin de déterminer si celle-ci
      entre dans le périmètre des entités régulées par la directive NIS&nbsp;2. En tout état de cause, recourir au simulateur, dont le résultat est
      dépendant de l'exactitude des données fournies en entrée, ne dispense pas
      d'une analyse au vu des textes en vigueur et des circonstances propres à
      chaque entité. Les résultats du test sont strictement indicatifs,
      dans l'attente de l'adoption définitive des textes législatifs et
      réglementaires de transposition de la directive NIS&nbsp;2."
  ></dsfr-highlight>

  <div class="actions">
    <dsfr-button use:clic={props.onsuivant}>Débuter le test</dsfr-button>
  </div>
</Etape>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .description {
    display: flex;
    flex-direction: column;
    align-items: center;

    @include a-partir-de(lg) {
      flex-direction: row;
      margin-bottom: 32px;
    }

    img {
      margin-bottom: 40px;

      @include a-partir-de(lg) {
        margin-bottom: 0;
      }
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 40px;
  }
</style>
