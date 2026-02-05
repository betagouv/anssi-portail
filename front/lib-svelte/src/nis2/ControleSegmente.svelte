<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';

  export let elements: { id: string; titre: string; ancre?: string }[];
  export let selecteurSections: string;
  let indexActif: number = 0;

  let observateurDIntersection: IntersectionObserver;
  let composant: HTMLDivElement;

  const sectionsDuComposant = () =>
    composant.querySelectorAll(selecteurSections);

  const observeLesSections = () => {
    observateurDIntersection = new IntersectionObserver(
      (sections) => {
        sections.forEach((section) => {
          const sections = composant.querySelectorAll(selecteurSections);

          if (section.isIntersecting) {
            const sectionVisible = section.target as HTMLElement;
            indexActif = Array.from(sections).indexOf(sectionVisible);
          }
        });
      },
      { rootMargin: '-30% 0% -62% 0%' }
    );
    sectionsDuComposant().forEach((s) => observateurDIntersection.observe(s));
  };

  onMount(async () => {
    await tick();
    observeLesSections();
  });

  onDestroy(() =>
    sectionsDuComposant().forEach((s) => observateurDIntersection.unobserve(s))
  );
</script>

<div bind:this={composant}>
  <dsfr-container class="conteneur">
    <div class="controle-segmente">
      {#each elements as element, index (element.id)}
        <a
          href="#{element.ancre ?? element.id}"
          class="bouton-segmente"
          class:actif={index === indexActif}>{element.titre}</a
        >
      {/each}
    </div>
  </dsfr-container>
  <slot></slot>
</div>

<style lang="scss">
  .conteneur {
    padding-block: 16px;
    overflow: auto;
    background: var(--background-default-grey);
    position: sticky;
    top: 0;
    z-index: 2;
  }
</style>
