<script lang="ts">
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';

  type Onglet = { emoji?: string; label: string; fragment: string };
  type Props = {
    onglets: Onglet[];
    ongletActif: number;
  };

  let { onglets, ongletActif = $bindable() }: Props = $props();

  const changeLOngletCourant = () => {
    const hash = new URLSearchParams(window.location.hash?.substring(1));
    const ongletDansLUrl = Array.from(hash)[0];
    if (ongletDansLUrl) {
      ongletActif =
        onglets.findIndex((o) => o.fragment === `#${ongletDansLUrl[0]}`) ?? 0;

      const section = document.querySelector('.menu-onglets');
      section?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  };

  onMount(() => {
    changeLOngletCourant();
  });

  $effect(() => {
    window.addEventListener('hashchange', changeLOngletCourant);
    return () => window.removeEventListener('hashchange', changeLOngletCourant);
  });

  let open = $state(false);
  const surLeClicDeLEntete = (event: Event) => {
    event.preventDefault();
    open = !open;
  };

  const surLeClicDUnOnglet = (onglet: Onglet, indice: number) => {
    ongletActif = indice;
    open = false;
  };
</script>

<div class={['menu-onglets', { open }]}>
  <button
    class="entete"
    type="button"
    aria-controls="onglets"
    aria-expanded={open}
    use:clic={surLeClicDeLEntete}
  >
    <span>Naviguer dans CyberEnJeux</span>
  </button>
  <div class="fr-text onglets" id="onglets">
    <ol>
      {#each onglets as onglet, indice (onglet.label)}
        <li class={{ actif: onglets[ongletActif] === onglet }}>
          <a
            href={onglet.fragment}
            use:clic={() => surLeClicDUnOnglet(onglet, indice)}
          >
            {#if onglet.emoji}
              <span aria-hidden="true">{onglet.emoji}</span>
            {/if}
            <span>{onglet.label}</span>
          </a>
        </li>
      {/each}
    </ol>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  @mixin focus() {
    &:focus {
      outline-style: none;
    }

    &:focus-visible {
      outline-offset: 2px;
      outline-width: 2px;
      outline-color: var(--bleu-contour-mis-en-valeur);
      outline-style: solid;
    }
  }

  .menu-onglets {
    background-color: var(--background-default-grey);
    box-sizing: border-box;
    margin-inline: -1rem;
    font-size: 1rem;
    line-height: 1.5rem;

    .entete {
      appearance: none;
      background-color: var(--background-default-grey);
      border-block: 1px solid var(--jaune-msc);
      border-inline-width: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      height: 3rem;
      font: inherit;
      font-weight: 500;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      text-align: left;
      width: 100%;

      span {
        flex: 1;
      }

      &::marker,
      &::-webkit-details-marker {
        display: none;
      }

      &::before,
      &::after {
        --icon-size: 1rem;

        background-color: currentColor;
        content: '';
        flex: 0 0 auto;
        height: var(--icon-size);
        width: var(--icon-size);
        mask-size: 100% 100%;
      }

      &::before {
        -webkit-mask-image: url('/icons/system/menu-2-fill.svg');
        mask-image: url('/icons/system/menu-2-fill.svg');
      }

      &::after {
        -webkit-mask-image: url('/icons/arrows/arrow-down-s-line.svg');
        mask-image: url('/icons/arrows/arrow-down-s-line.svg');
        transform: rotate(0deg);
        transition: transform 0.2s ease-in-out;
      }

      @include focus();
    }

    .onglets {
      border-bottom: 1px solid var(--jaune-msc);
      display: none;
      max-height: 0;
      transition:
        display,
        max-height 0.2s ease;
      transition-behavior: allow-discrete;
      margin-bottom: 48px;
    }

    &.open {
      .entete {
        background-color: var(--background-open-blue-france);

        &::after {
          transform: rotate(-180deg);
        }
      }

      .onglets {
        display: block;
        max-height: initial;
      }
    }

    ol {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        padding-inline: 1rem;

        a {
          color: var(--text-action-high-grey);
          display: block;
          font-weight: bold;
          padding: 0.75rem 0.5rem;
          position: relative;
          width: auto;

          &::before {
            background-color: transparent;
            inset: 0.75rem 0;
            content: '';
            position: absolute;
            width: 2px;
          }

          @include focus();
        }

        &:not(:first-child) a {
          border-top: 1px solid var(--border-default-grey);
        }

        &.actif a {
          color: var(--noir);

          &::before {
            background-color: var(--jaune-msc);
          }
        }
      }
    }

    @include a-partir-de(md) {
      display: flex;
      margin: 2rem auto 0;
      justify-content: center;
      width: clamp(200px, 100%, 639px);

      .entete {
        display: none;
      }

      .onglets {
        display: block;
        font-size: 0.875rem;
        font-weight: normal;
        max-height: initial;
        padding-top: 0;
        border-bottom-width: 0;
      }

      ol {
        display: flex;
        justify-content: center;
        flex-flow: row nowrap;

        li {
          padding-inline: 0;

          a {
            border-bottom: 1px solid var(--border-default-grey);
            font-weight: normal;
            padding-inline: 0.75rem;
            white-space: nowrap;
            width: fit-content;

            &:hover {
              background-color: var(--background-default-grey-hover);
              border-bottom-color: var(--jaune-msc);
            }
          }

          &:not(:first-child) a {
            border-top-width: 0;
          }

          &.actif a {
            border-bottom-color: var(--jaune-msc);

            &::before {
              bottom: 0;
              top: initial;
              height: 1px;
              width: 100%;
            }
          }
        }
      }
    }
  }
</style>
