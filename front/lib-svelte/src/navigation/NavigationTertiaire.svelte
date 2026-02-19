<script lang="ts">
  import { onMount } from 'svelte';
  import { clic } from '../directives/actions.svelte';

  type Lien = { emoji?: string; label: string; fragment: string };
  type Props = {
    liens: Lien[];
    lienActif: string;
  };

  let { liens, lienActif = $bindable() }: Props = $props();

  const changeLeLienCourant = () => {
    const hash = new URLSearchParams(window.location.hash?.substring(1));
    const lienDansLUrl = Array.from(hash)[0];
    if (lienDansLUrl) {
      lienActif =
        liens.find((o) => o.fragment === `#${lienDansLUrl[0]}`)?.fragment ?? liens[0].fragment;
    }
  };

  onMount(() => {
    changeLeLienCourant();
  });

  $effect(() => {
    window.addEventListener('hashchange', changeLeLienCourant);
    return () => window.removeEventListener('hashchange', changeLeLienCourant);
  });

  let open = $state(false);
  const surLeClicDeLEntete = (event: Event) => {
    event.preventDefault();
    open = !open;
  };

  const surLeClicDUnLien = (lien: Lien) => {
    lienActif = lien.fragment;
    open = false;
  };
</script>

<div class={['navigation-tertiaire', { open }]}>
  <button
    class="entete"
    type="button"
    aria-controls="navigation-tertiaire"
    aria-expanded={open}
    use:clic={surLeClicDeLEntete}
  >
    <lab-anssi-icone nom="menu-2-fill" taille="sm"></lab-anssi-icone>
    <span>Naviguer</span>
    {#if open}
      <lab-anssi-icone nom="arrow-up-s-line" taille="sm"></lab-anssi-icone>
    {:else}
      <lab-anssi-icone nom="arrow-down-s-line" taille="sm"></lab-anssi-icone>
    {/if}
  </button>
  <div class="fr-text liens" id="navigation-tertiaire">
    <ol>
      {#each liens as lien (lien.label)}
        <li class={{ actif: lien.fragment===lienActif }}>
          <a
            href={lien.fragment}
            use:clic={() => surLeClicDUnLien(lien)}
          >
            {#if lien.emoji}
              <span aria-hidden="true">{lien.emoji}</span>
            {/if}
            <span>{lien.label}</span>
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

  .navigation-tertiaire {
    background-color: var(--background-default-grey);
    box-sizing: border-box;
    font-size: 1rem;
    line-height: 1.5rem;

    .entete {
      appearance: none;
      background-color: var(--background-default-grey);
      border-block: 1px solid var(--border-default-grey);
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

      @include focus();
    }

    .liens {
      border-bottom: 1px solid var(--border-default-grey);
      display: none;
      max-height: 0;
      transition:
        display,
        max-height 0.2s ease;
      transition-behavior: allow-discrete;
    }

    &.open {
      .entete {
        background-color: var(--background-open-blue-france);

        &::after {
          transform: rotate(-180deg);
        }
      }

      .liens {
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
            background-color: var(--border-active-blue-france);
            @include a-partir-de(md) {
              background-color: var(--background-active-blue-france);
            }
          }
        }
      }
    }

    @include a-partir-de(md) {
      display: flex;
      margin: 2rem auto 1.5rem;
      justify-content: center;
      width: clamp(200px, 100%, 639px);

      .entete {
        display: none;
      }

      .liens {
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
              border-bottom-color: var(--background-active-blue-france);
            }
          }

          &:not(:first-child) a {
            border-top-width: 0;
          }

          &.actif a {
            border-bottom-color: var(--background-active-blue-france);

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
