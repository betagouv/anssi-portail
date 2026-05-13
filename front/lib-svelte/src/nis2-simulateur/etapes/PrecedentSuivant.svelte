<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import { questionnaireAvecUndo } from '../stores/questionnaireAvecUndo.store';

  interface Props {
    message: string;
    onsuivant: () => void;
    suivantdisabled: boolean;
    precedentdisabled?: boolean;
  }

  let { message, onsuivant, suivantdisabled, precedentdisabled }: Props = $props();
</script>

<div class="actions">
  <p>{message}</p>

  <dsfr-button use:clic={questionnaireAvecUndo.undo} kind="secondary" disabled={precedentdisabled}>
    Précédent
  </dsfr-button>

  <dsfr-button disabled={suivantdisabled} use:clic={onsuivant}> Suivant </dsfr-button>
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
      color: var(--text-disabled-grey);
    }
  }
</style>
