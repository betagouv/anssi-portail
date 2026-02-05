<script lang="ts">
  export let href: string;
  export let label: string;
  export let dansMenuDeroulant = false;
  export let prefixCheminActif: string | undefined = undefined;

  const cheminRelatif = window.location.pathname;
</script>

<a
  {href}
  class:actif={prefixCheminActif
    ? cheminRelatif.startsWith(prefixCheminActif)
    : cheminRelatif === href}
  class:dans-menu-deroulant={dansMenuDeroulant}>{label}</a
>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  a {
    border-bottom: 2px solid transparent;
    padding: 16px 8px;
    font-size: 0.875rem;

    &:hover {
      background: var(--menu-fond-hover);
    }

    &:active {
      background: var(--menu-fond-clique);
    }

    &.actif {
      font-weight: 500;
      border-bottom-color: var(--jaune-msc);
    }
  }

  .dans-menu-deroulant {
    width: 100%;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-default-grey);
    position: relative;
    font-weight: normal;
    box-sizing: border-box;

    &.actif {
      font-weight: normal;
      border-bottom: 1px solid var(--border-default-grey);

      &:before {
        content: '';
        display: block;
        width: 2px;
        height: 24px;
        background: var(--jaune-msc);
        position: absolute;
        left: 0;
      }
    }

    &:last-child {
      border: none;
    }
  }
</style>
