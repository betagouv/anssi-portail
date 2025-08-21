<script lang="ts">
  import axios from 'axios';
  import { onDestroy, onMount, tick } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import BadgeTypeFinancement from './BadgeTypeFinancement.svelte';
  import type { Financement } from './financement';
  import MenuFinancement from './MenuFinancement.svelte';
  import SectionDetailsFinancement from './SectionDetailsFinancement.svelte';

  type ReponseAxios = {
    id: number;
    nom: string;
    financeur: string;
    typesDeFinancement: string[];
    entitesElligibles: string[];
    perimetresGeographiques: string[];
    regions: string[];
    objectifs: string;
    operationsEligibles: string;
    benificiaires: string;
    montant: string;
    condition: string;
    sources: string[];
    contact: string;
  };

  let financement: Financement | undefined = $state();
  let entreesMenuFinancement: Record<string, string> | undefined = $state();

  const idFinancement = Number(
    new URLSearchParams(window.location.search).get('idFinancement')
  );

  onMount(async () => {
    try {
      const reponse = await axios.get<ReponseAxios>(
        `/api/financements/${idFinancement}`
      );
      financement = reponse.data;
      const entrees: [string, string][] = [];
      if (financement.objectifs) entrees.push(['objectifs', 'Objectifs']);
      if (financement.operationsEligibles)
        entrees.push(['operations-eligibles', 'Opérations éligibles']);
      if (financement.benificiaires)
        entrees.push(['beneficiaires', 'Bénéficiaires']);
      if (financement.montant) entrees.push(['montant', 'Montant']);
      if (financement.condition) entrees.push(['conditions', 'Conditions']);
      entreesMenuFinancement = Object.fromEntries(entrees);
    } catch {
      financement = undefined;
    }
  });

  let contenu: HTMLDivElement;
  let observateurDIntersection: IntersectionObserver;

  const observeLesSections = () => {
    observateurDIntersection = new IntersectionObserver(
      (sections) => {
        sections.forEach((section) => {
          const titreDeLaSection = section.target.querySelector('h2');
          const lesLiens = contenu.querySelectorAll(
            `.sommaire ul li a[href='#${titreDeLaSection!.id}']`
          );

          if (!lesLiens || !lesLiens.length) return;

          if (section.isIntersecting) {
            lesLiens.forEach((l) => l.parentElement!.classList.add('actif'));

            const menuMobileVisible = contenu.querySelector('#section-active');
            if (menuMobileVisible)
              menuMobileVisible.textContent = titreDeLaSection!.textContent;
          } else
            lesLiens.forEach((l) => l.parentElement!.classList.remove('actif'));
        });
      },
      { rootMargin: '-10% 0% -20% 0%' }
    );

    const lesSections = contenu.querySelectorAll('section');
    lesSections.forEach((s) => observateurDIntersection.observe(s));
  };

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

  $effect(() => {
    if (financement) {
      scroll(window.location.hash);
      tick().then(observeLesSections);
    }
  });

  onDestroy(() => {
    const lesSections = contenu!.querySelectorAll('section');
    lesSections.forEach((s) => {
      if (observateurDIntersection) observateurDIntersection.unobserve(s);
    });
  });
</script>

<section class="chapeau">
  <div class="contenu-section">
    <FilAriane
      feuille={financement?.nom ?? '...'}
      branche={{ nom: 'Financements cyber', lien: '/financements' }}
    />
    <div class="badges">
      {#if financement}
        {#each financement.typesDeFinancement as type (type)}
          <BadgeTypeFinancement>{type}</BadgeTypeFinancement>
        {/each}
      {/if}
    </div>
    <h1>{financement?.nom}</h1>
    <p>
      Zone géographique éligible pour cette aide&nbsp;: {financement?.perimetresGeographiques}
    </p>
    {#if financement?.sources?.[0]}
      <div class="source">
        <lab-anssi-lien
          href={financement.sources[0]}
          cible="_blank"
          apparence="bouton"
          variante="primaire"
          taille="lg"
          titre="Bénéficier de cette aide"
        ></lab-anssi-lien>
      </div>
    {/if}
  </div>
</section>

<div bind:this={contenu}>
  {#if financement}
    {#if entreesMenuFinancement}
      <MenuFinancement
        dictionnaireAncreLibelle={entreesMenuFinancement}
        mode="mobile"
        tags={financement.entitesElligibles}
      />
    {/if}

    <section class="corps">
      <div class="contenu-section">
        {#if entreesMenuFinancement}
          <MenuFinancement
            dictionnaireAncreLibelle={entreesMenuFinancement}
            mode="desktop"
            tags={financement.entitesElligibles}
          />
        {/if}
        <div class="fiche">
          <div class="financePar">
            <p>Financé par : <strong>{financement.financeur}</strong></p>
          </div>
          <SectionDetailsFinancement
            ancre="objectifs"
            titre="Objectifs"
            detail={financement.objectifs}
          />
          <SectionDetailsFinancement
            ancre="operations-eligibles"
            titre="Opérations éligibles"
            detail={financement.operationsEligibles}
          />

          <SectionDetailsFinancement
            ancre="beneficiaires"
            titre="Bénéficiaires"
            detail={financement.benificiaires}
          />

          <SectionDetailsFinancement
            ancre="montant"
            titre="Montant"
            detail={financement.montant}
          />

          <SectionDetailsFinancement
            ancre="conditions"
            titre="Conditions"
            detail={financement.condition}
          />
          <lab-anssi-lien
            href="#"
            titre="Haut de page"
            icone="arrow-up-fill"
            positionIcone="gauche"
          ></lab-anssi-lien>
        </div>
      </div>
    </section>
  {/if}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding: 0 var(--gouttiere) 40px;
  }

  .chapeau {
    background: #f4f4f4 url('/assets/images/motif-fond-service.png');
    padding-top: 24px;

    .contenu-section {
      display: flex;
      flex-direction: column;

      .source {
        display: flex;
        margin-top: 24px;
      }
    }

    @include a-partir-de(md) {
      gap: 16px;
    }

    .badges {
      display: flex;
      align-items: flex-start;
      align-content: flex-start;
      gap: 8px;
      align-self: stretch;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    h1 {
      font-size: 2.5rem;
      line-height: 2.875rem;
      margin: 0 0 8px;

      @include a-partir-de(md) {
        font-size: 3.5rem;
        line-height: 3.875rem;
      }
    }

    p {
      margin: 0;
      font-size: 1.25rem;
      line-height: 2rem;
      color: #3a3a3a;

      @include a-partir-de(md) {
        font-size: 1.375rem;
        line-height: 2rem;
      }
    }
  }

  .corps {
    padding: 48px 16px 72px;
    @include a-partir-de(md) {
      padding: 24px 24px 72px;
    }

    .contenu-section {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      align-self: stretch;

      .fiche {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 0 0;
        .financePar {
          margin-top: 24px;
          margin-bottom: 32px;
        }
      }
    }
  }
</style>
