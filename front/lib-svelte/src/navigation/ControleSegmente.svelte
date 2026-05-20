<script lang="ts">
  import { creeLeFragmentDeNavigation, type FragmentDeNavigation } from './fragmentDeNavigation';

  type Props = {
    elements: {
      id: string;
      titre: string;
      ancre?: string;
      icone?: string;
    }[];
    indexActif: number;
    fragmentDeNavigation?: FragmentDeNavigation;
    lorsDuChangement?: (fragmentDeNavigation: FragmentDeNavigation) => void;
    lorsDuClic?: (index: number) => void;
  };
  let {
    elements,
    indexActif = $bindable(0),
    fragmentDeNavigation = creeLeFragmentDeNavigation(window.location.hash),
    lorsDuChangement,
    lorsDuClic,
  }: Props = $props();
  const hasIcon = $derived(elements.some((e) => !!e.icone));

  // Gestion du fragment
  const changeLeFragmentDeNavigation = () => {
    fragmentDeNavigation = creeLeFragmentDeNavigation(window.location.hash);
    lorsDuChangement?.(fragmentDeNavigation);
  };
  $effect(() => {
    window.addEventListener('hashchange', changeLeFragmentDeNavigation);
    return () => {
      window.removeEventListener('hashchange', changeLeFragmentDeNavigation);
    };
  });
  const changeDeSection = (index: number) => {
    indexActif = index;
    if (lorsDuClic) {
      lorsDuClic(index);
      return;
    }
    const ancre = elements[indexActif].ancre;
    if (ancre) {
      fragmentDeNavigation.changeSection(ancre);
      window.location.hash = fragmentDeNavigation.serialise();
    }
  };
</script>

<div class="conteneur">
  <dsfr-segmented
    noLegend
    {hasIcon}
    elements={elements.map((e, idx) => ({ id: e.id, name: e.id, label: e.titre, icon: e.icone, value: idx }))}
    value={indexActif}
    onvaluechanged={(e: CustomEvent<number>) => changeDeSection(e.detail)}
  ></dsfr-segmented>
</div>

<style lang="scss">
  .conteneur {
    padding-block: 16px;
    background: var(--background-default-grey);
    position: sticky;
    top: 0;
    z-index: calc(var(--ground) + 751);

    display: grid;
    place-items: center;
  }
</style>
