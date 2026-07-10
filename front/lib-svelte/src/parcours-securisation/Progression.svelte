<script lang="ts">
  interface Props {
    actuel: number;
    max: number;
    cible?: number;
    mode?: 'compact' | 'reactif';
    libelle?: string;
  }

  const { actuel, max, cible, mode = 'reactif', libelle = 'Progression' }: Props = $props();

  let barre: HTMLElement;
  $effect(() => {
    barre.style.setProperty('--largeur-actuelle', `${Math.min((actuel / max) * 100, 100)}%`);
    if (cible) {
      barre.style.setProperty('--position-cible', `${Math.min((cible / max) * 100, 100)}%`);
    }
  });
</script>

<div class={`${mode} progression`}>
  <h6>{libelle}</h6>
  <span class="texte-standard-md libelle">{actuel}&nbsp;/&nbsp;{max}</span>
  <div class="barre" bind:this={barre}>
    <div class="barre-actuelle"></div>
    {#if cible}
      <div
        class="badge-recompense"
        class:actif={actuel >= cible}
        title={actuel < cible ? 'Validez des actions pour accéder à votre Cyberdépart' : ''}
      ></div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .progression {
    display: grid;
    gap: 1rem;
    grid-template-areas:
      'titre libelle'
      'barre barre';
    grid-template-columns: min-content auto;
    align-items: center;
    &.compact {
      grid-template-columns: auto min-content;
    }
    &.reactif {
      @include a-partir-de(md) {
        grid-template-areas: 'titre barre libelle';
        grid-template-columns: min-content 384px auto;
      }
    }

    h6 {
      grid-area: titre;
    }
    .libelle {
      grid-area: libelle;
    }

    h6,
    span {
      margin: 0;
    }

    .barre {
      grid-area: barre;
      height: 12px;
      background-color: var(--background-contrast-grey);
      border-radius: 999px;
      position: relative;
      max-width: 384px;

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
