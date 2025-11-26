<script lang="ts">
  import { onMount, tick } from 'svelte';
  import TableDesMatieres from './TableDesMatieres.svelte';

  type Props = {
    children: () => any;
    apresMenu: () => any;
    surligneUnSeulElementDansTableDesMatieres?: boolean;
  };
  const {
    children,
    apresMenu,
    surligneUnSeulElementDansTableDesMatieres = false,
  }: Props = $props();

  let conteneur: HTMLElement;
  let contenu: HTMLElement;

  let estMobile = $state(false);

  let sections = $state([] as HTMLElement[]);
  const entetes = $derived(() => [
    ...sections
      .map((section) => section.querySelector<HTMLHeadingElement>('h1,h2,h3'))
      .filter((e) => !!e)
      .flat(),
  ]);

  let sectionsVisibles = $state([] as HTMLElement[]);

  let sectionActive = $state(undefined as HTMLElement | undefined);
  const enteteActive = $derived(
    () =>
      sectionActive?.querySelector<HTMLHeadingElement>('h1,h2,h3') ?? undefined
  );

  onMount(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const metAJourEstMobile = () => (estMobile = mql.matches);
    mql.addEventListener('change', metAJourEstMobile);
    metAJourEstMobile();

    sections = [...conteneur.querySelectorAll<HTMLElement>('.content section')];

    const callback = (entrees: IntersectionObserverEntry[]) => {
      entrees.reverse().forEach((entree) => {
        if (entree.isIntersecting) {
          sectionsVisibles.push(entree.target as HTMLElement);
        } else {
          sectionsVisibles.splice(
            sectionsVisibles.indexOf(entree.target as HTMLElement),
            1
          );
        }
      });
      sectionActive = sections.filter((section) =>
        sectionsVisibles.includes(section)
      )[0];
      const toc = conteneur.querySelector<HTMLElement>('.toc')!;
      const elementsToc = [...toc!.querySelectorAll('li')];
      elementsToc.forEach((element) => element.classList.remove('actif'));
      let sectionsAActiver = sections.filter((section) =>
        sectionsVisibles.includes(section)
      );
      if (surligneUnSeulElementDansTableDesMatieres) {
        sectionsAActiver = sectionsAActiver.slice(0, 1);
      }
      sectionsAActiver.forEach((section) => {
        const elementTocActif = toc?.querySelector(
          `li > a[href="#${section.id}"]`
        );
        elementTocActif?.parentElement!.classList.add('actif');
      });
    };
    const observateurIntersection = new IntersectionObserver(callback, {
      rootMargin: '-20px 0% 0% 0%',
    });
    sections.forEach((section) => observateurIntersection.observe(section));
    return () => {
      mql.removeEventListener('change', metAJourEstMobile);
      observateurIntersection.disconnect();
    };
  });

  const attendChargementImages = async () => {
    const images = contenu.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((res) => {
          image.addEventListener('load', res);
          image.addEventListener('error', res);
        });
      })
    );
  };

  const scroll = (cible: string) => {
    if (cible) {
      tick().then(async () => {
        const ancre = contenu && contenu.querySelector(cible);
        if (ancre) {
          await attendChargementImages();
          ancre.scrollIntoView(true);
        }
      });
    }
  };

  $effect(() => scroll(window.location.hash));
</script>

<article class:mobile={estMobile} bind:this={conteneur}>
  <div class="content" bind:this={contenu}>
    {@render children?.()}
  </div>
  <TableDesMatieres
    entetes={entetes()}
    enteteActive={enteteActive()}
    afficheModeReduit={estMobile}
  >
    {@render apresMenu?.()}
  </TableDesMatieres>
</article>

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  article {
    display: grid;
    gap: 24px;
    grid-template-rows: auto 1fr;
    grid-template-areas: 'toc' 'content';
    position: relative;
    align-items: flex-start;
  }

  :global article {
    .toc {
      grid-area: toc;
      position: sticky;
      top: 0;
    }

    .content {
      grid-area: content;
    }
  }

  @media (min-width: 768px) {
    article {
      grid-template-columns: 282px 1fr;
      grid-template-areas: 'toc content';
    }
  }
</style>
