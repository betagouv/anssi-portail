<script lang="ts">
  import { niveauxMaturite } from '../../niveaux-maturite/NiveauxMaturite.donnees';
  import type { IdNiveau, NiveauMaturite } from '../../niveaux-maturite/NiveauxMaturite.type';

  type Props = {
    niveau: IdNiveau;
  };

  const { niveau }: Props = $props();
  const niveauCourant = $derived(niveauxMaturite.find((courant) => courant.id === niveau) as NiveauMaturite);
</script>

<div class="tuile-niveau">
  <img class="plante" src="/assets/images/test-maturite/niveaux/{niveau}.svg" alt="Niveau de maturité" />
  <h6>{niveauCourant.label}</h6>
  <p class="texte-mention-xs">Comme 28&nbsp;% des organisations ayant réalisé le test.</p>
</div>

<style lang="scss">
  .tuile-niveau {
    position: relative;
    box-sizing: border-box;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    text-align: center;

    padding: 1rem;
    border: 1px solid transparent;
    border-radius: 0;
    background: var(--brown-cafe-creme-975-75);

    &:before {
      content: '';
      position: absolute;
      z-index: 0;
      top: 230px;
      border: 2px solid var(--border-plain-blue-france);
      left: 0;
      right: 0;
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: -4px;
      bottom: -4px;
      left: -4px;
      right: -4px;
      border-radius: 8px;
      border: 3px solid var(--border-default-blue-france);
    }

    .plante {
      z-index: 2;
    }

    h6,
    .texte-mention-xs {
      margin-bottom: 0;
    }
  }
</style>
