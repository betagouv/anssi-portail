<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import ControleSegmente from './ControleSegmente.svelte';
  import { creeLeFragmentDeNavigation } from './fragmentDeNavigation';

  type Props = {
    elements: {
      id: string;
      titre: string;
      ancre?: string;
      icone?: string;
    }[];
    selecteurSections: string;
  };
  let { elements, selecteurSections }: Props = $props();

  let indexActif = $state(0);
  // Non-reactive flag : supprime l'observateur pendant les scrolls programmatiques
  let scrollProgrammatique = false;
  let composant = $state<HTMLDivElement | undefined>(undefined);
  let observateurDIntersection: IntersectionObserver;

  const sectionsDuComposant = () => composant?.querySelectorAll(selecteurSections);
  const ancreDeSection = (index: number) => elements[index].ancre ?? elements[index].id;

  // Met à jour le hash sans déclencher de scroll navigateur
  const miseAJourHash = (index: number) => {
    const fragment = creeLeFragmentDeNavigation(window.location.hash);
    fragment.changeSection(ancreDeSection(index));
    const nouveauHash = fragment.serialise();
    if (window.location.hash !== nouveauHash) {
      window.location.hash = nouveauHash;
    }
  };

  // Scroll programmatique vers une section, avec suppression temporaire de l'observateur
  const scrollVersSection = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const sections = sectionsDuComposant();
    const section = sections?.[index];
    if (!section) return;

    scrollProgrammatique = true;
    section.scrollIntoView({ behavior, block: 'start' });

    document.addEventListener('scrollend', () => (scrollProgrammatique = false), { once: true });
  };

  // Appelé par ControleSegmente au clic utilisateur (remplace la mise à jour du hash par défaut)
  const lorsDuClic = (index: number) => {
    miseAJourHash(index);
    scrollVersSection(index, 'smooth');
  };

  const observeLesSections = () => {
    observateurDIntersection = new IntersectionObserver(
      (entries) => {
        if (scrollProgrammatique) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sections = Array.from(sectionsDuComposant() ?? []);
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx >= 0) {
              indexActif = idx;
              miseAJourHash(idx);
            }
          }
        }
      },
      { rootMargin: '-30% 0% -62% 0%' }
    );
    sectionsDuComposant()?.forEach((s) => observateurDIntersection.observe(s));
  };

  onMount(() => {
    // Désactive la restauration automatique du scroll par le navigateur pour que notre
    // scroll programmatique vers la section cible ne soit pas écrasé par la position
    // sauvegardée dans l'historique (cause du léger scroll vers le haut à l'entrée).
    const scrollRestorationPrecedente = history.scrollRestoration;
    history.scrollRestoration = 'manual';

    // Détermine la section initiale depuis le hash
    const fragment = creeLeFragmentDeNavigation(window.location.hash);
    if (fragment.section) {
      const idx = elements.findIndex((e) => (e.ancre ?? e.id) === fragment.section);
      if (idx >= 0) indexActif = idx;
    }

    const initApresChargement = () => {
      // Scroll instantané vers la section cible une fois la page entièrement chargée
      // (évite les décalages de layout dus aux images/fonts en cours de chargement)
      scrollProgrammatique = true;
      const sections = sectionsDuComposant();
      if (sections && indexActif > 0) {
        (sections[indexActif] as HTMLElement).scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      // Démarre l'observateur ; le flag supprime les faux déclenchements initiaux
      observeLesSections();
      setTimeout(() => {
        scrollProgrammatique = false;
      }, 100);
    };

    if (document.readyState === 'complete') {
      initApresChargement();
    } else {
      window.addEventListener('load', initApresChargement, { once: true });
    }

    return () => {
      window.removeEventListener('load', initApresChargement);
      history.scrollRestoration = scrollRestorationPrecedente;
    };
  });

  onDestroy(() => sectionsDuComposant()?.forEach((s) => observateurDIntersection?.unobserve(s)));
</script>

<ControleSegmente {elements} bind:indexActif {lorsDuClic}></ControleSegmente>
<div bind:this={composant}>
  <slot></slot>
</div>
