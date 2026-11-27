<script lang="ts">
  import Bouton from '@ui/Bouton.svelte';

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

  <Bouton libelle="Précédent" type="secondaire" desactive={precedentdisabled} surClic={questionnaireAvecUndo.undo} />

  <Bouton libelle="Suivant" desactive={suivantdisabled} surClic={onsuivant} />
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
