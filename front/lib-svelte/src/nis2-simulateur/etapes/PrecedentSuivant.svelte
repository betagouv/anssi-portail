<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import { questionnaireAvecUndo } from '../stores/questionnaireAvecUndo.store';

  interface Props {
    message: string;
    onsuivant: () => void;
    suivantdisabled: boolean;
    precedentdisabled?: boolean;
  }

  let props: Props = $props();
</script>

<div class="actions">
  <p>{props.message}</p>

  <dsfr-button
    use:clic={questionnaireAvecUndo.undo}
    kind="secondary"
    disabled={props.precedentdisabled}
  >
    Précédent
  </dsfr-button>

  <dsfr-button disabled={props.suivantdisabled} use:clic={props.onsuivant}>
    Suivant
  </dsfr-button>
</div>

<style lang="scss">
  .actions {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: end;
    gap: 24px;

    p {
      font-size: 0.9rem;
      color: #929292;
    }
  }
</style>
