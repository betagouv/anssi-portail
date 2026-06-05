<script lang="ts">
  interface Props {
    actuel: number;
    max: number;
    cible: number;
  }

  const { actuel, max, cible }: Props = $props();

  let barre: HTMLElement;
  $effect(() => {
    barre.style.setProperty('--largeur-actuelle', `${Math.min((actuel / max) * 100, 100)}%`);
    barre.style.setProperty('--position-cible', `${Math.min((cible / max) * 100, 100)}%`);
  });
</script>

<div class="progression">
  <div class="libelle">
    <h6>Progression</h6>
    <span class="texte-standard-md">{actuel}&nbsp;/&nbsp;{max}</span>
  </div>
  <div class="barre" bind:this={barre}>
    <div class="barre-actuelle"></div>
    <div
      class="badge-recompense"
      class:actif={actuel >= cible}
      title={actuel < cible ? 'Validez des actions pour accéder à votre Cyberdépart' : ''}
    ></div>
  </div>
</div>

<style lang="scss">
  .progression {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .libelle {
      display: flex;
      gap: 1rem;
      align-items: center;

      h6,
      span {
        margin: 0;
      }
    }

    .barre {
      height: 12px;
      background-color: var(--background-contrast-grey);
      border-radius: 999px;
      position: relative;

      .barre-actuelle {
        height: 100%;
        border-radius: 999px;
        min-width: 0;
        transition: width 0.3s ease;
        width: var(--largeur-actuelle);
        background: linear-gradient(90deg, var(--green-emeraude-850-200) 0%, var(--green-emeraude-main-632) 100%);
      }

      .badge-recompense {
        height: 32px;
        width: 32px;
        position: absolute;
        top: -10px;
        left: calc(var(--position-cible) - 16px);
        border-radius: 32px;
        background-color: white;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);

        &::before {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          background-color: var(--text-disabled-grey);
          mask: url('/assets/icones/icone-recompense.svg') no-repeat center;
        }

        &.actif::before {
          background-color: var(--background-flat-success);
        }
      }
    }
  }
</style>
