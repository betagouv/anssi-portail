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
    font-weight: bold;
    width: calc(100% - 32px);
    border-bottom: 1px solid var(--border-default-grey);
    padding: 12px 16px;

    &.actif {
      position: relative;

      &:before {
        content: '';
        display: block;
        width: 2px;
        height: 24px;
        left: 0;
        background-color: var(--background-active-blue-france);
        position: absolute;
      }
    }
  }

  .dans-menu-deroulant {
    border-bottom: none;
    font-weight: normal;
  }
</style>
