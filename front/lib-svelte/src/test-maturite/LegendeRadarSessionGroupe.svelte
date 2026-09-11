<script lang="ts">
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
</script>

<div class="legende">
  {#each niveauxMaturite as niveau (niveau.id)}
    <div class="ligne-legende ligne-legende-{niveau.id}">
      <span class="libelle">{niveau.label}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .legende {
    display: flex;
    flex-direction: row;
    gap: 24px;
    justify-content: space-between;
    padding: 24px;
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
    --couleur-puce: #5c68e5;
  }

  .ligne-legende-emergent {
    --couleur-puce: #82b5f2;
  }

  .ligne-legende-intermediaire {
    --couleur-puce: #28598f;
  }

  .ligne-legende-confirme {
    --couleur-puce: #30a7ae;
  }

  .ligne-legende-optimal {
    --couleur-puce: #81eef5;
  }
</style>
