<script lang="ts">
  import {niveauxMaturite} from "../niveaux-maturite/NiveauxMaturite.donnees";
</script>

<div class="legende">
  {#each niveauxMaturite as niveau (niveau.id)}
    <div class="ligne-legende ligne-legende-{niveau.id}">
      <span class="libelle">{niveau.label}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .legende {
    display: none;
    flex-direction: row;
    gap: 24px;
    justify-content: space-between;
    padding: 24px;
    @include a-partir-de(sm) {
      display: flex;
    }
  }

  .ligne-legende {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .ligne-legende:before {
    width: 14px;
    height: 14px;
    border-radius: 7px;
    content: '';
    background-color: var(--couleur-puce);
  }

  .ligne-legende-insuffisant {
    --couleur-puce: #6369f1;
  }

  .ligne-legende-emergent {
    --couleur-puce: #fec54b;
  }

  .ligne-legende-intermediaire {
    --couleur-puce: #8248a1;
  }

  .ligne-legende-confirme {
    --couleur-puce: #f26c85;
  }

  .ligne-legende-optimal {
    --couleur-puce: #8ed4a3;
  }
</style>