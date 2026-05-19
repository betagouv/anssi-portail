<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';

  type Props = {
    elements: { id: string; titre: string; ancre?: string }[];
    selecteurSections: string;
  };
  let { elements, selecteurSections }: Props = $props();

  let indexActif = $state(0);

  let observateurDIntersection: IntersectionObserver;
  let composant = $state<HTMLDivElement | undefined>(undefined);

  const sectionsDuComposant = () => composant?.querySelectorAll(selecteurSections);
  const observeLesSections = () => {
    observateurDIntersection = new IntersectionObserver(
      (sections) => {
        sections.forEach((section) => {
          const sections = composant?.querySelectorAll(selecteurSections) ?? [];

          if (section.isIntersecting) {
            const sectionVisible = section.target as HTMLElement;
            indexActif = Array.from(sections).indexOf(sectionVisible);
          }
        });
      },
      { rootMargin: '-30% 0% -62% 0%' }
    );
    sectionsDuComposant()?.forEach((s) => observateurDIntersection.observe(s));
  };

  onMount(async () => {
    await tick();
    observeLesSections();
  });

  onDestroy(() => sectionsDuComposant()?.forEach((s) => observateurDIntersection.unobserve(s)));
</script>

<dsfr-segmented
  class="conteneur"
  noLegend
  elements={elements.map((e, idx) => ({ id: e.id, label: e.titre, name: e.ancre, value: idx }))}
  value={indexActif}
  onvaluechanged={(e: CustomEvent<number>) => {
    indexActif = e.detail;
    const fragment = elements[indexActif].ancre;
    window.location.hash = fragment ? `#${fragment}` : '';
  }}
></dsfr-segmented>
<div bind:this={composant}>
  <slot></slot>
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
