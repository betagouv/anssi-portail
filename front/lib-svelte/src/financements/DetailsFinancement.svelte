<script lang="ts">
  import axios from 'axios';
  import { onMount, tick, untrack } from 'svelte';

  import type { PropriétésFilAriane } from '@ui/filAriane';
  import Heros from '@ui/Heros.svelte';
  import Lien from '@ui/Lien.svelte';

  import BadgeTypeFinancement from './BadgeTypeFinancement.svelte';
  import type { Financement } from './financement';
  import MenuFinancement from './MenuFinancement.svelte';
  import SectionDetailsFinancement from './SectionDetailsFinancement.svelte';

  type Props = {
    financementInitial?: Financement;
    idFinancement?: number;
  };

  const { financementInitial, idFinancement }: Props = $props();

  let financement: Financement | undefined = $state(untrack(() => financementInitial));
  let entreesMenuFinancement: Record<string, string> | undefined = $state();

  onMount(() => {
    (async () => {
      try {
        const reponse = await axios.get<Financement>(`/api/financements/${idFinancement}`);
        financement = reponse.data;
        const entrees: [string, string][] = [];
        if (financement.objectifs) entrees.push(['objectifs', 'Objectifs']);
        if (financement.opérationsÉligibles) entrees.push(['operations-eligibles', 'Opérations éligibles']);
        if (financement.bénéficiaires) entrees.push(['beneficiaires', 'Bénéficiaires']);
        if (financement.montant) entrees.push(['montant', 'Montant']);
        if (financement.condition) entrees.push(['conditions', 'Conditions']);
        entreesMenuFinancement = Object.fromEntries(entrees);
      } catch {
        financement = undefined;
      }
    })();

    return () => {
      const lesSections = contenu!.querySelectorAll('section');
      lesSections.forEach((s) => {
        if (observateurDIntersection) observateurDIntersection.unobserve(s);
      });
    };
  });

  let contenu: HTMLDivElement;
  let observateurDIntersection: IntersectionObserver;

  const observeLesSections = () => {
    const toutesLesSections = contenu.querySelectorAll('section:not(.corps)');
    let titreActif: HTMLHeadingElement | undefined =
      toutesLesSections[0].querySelector<HTMLHeadingElement>('h2') ?? undefined;
    observateurDIntersection = new IntersectionObserver(
      (entrees) => {
        // ATTENTION :`entrees` PEUT contenir toutes les sections lors du premier appel mais
        // contient uniquement les sections qui entrent ou sortent du viewport lors des appels suivants !
        const liensActifs = contenu.querySelectorAll('.sommaire ul li.actif a');
        let titreAActiver =
          entrees
            .filter((e) => e.isIntersecting)
            .map((entree) => entree.target.querySelector('h2'))
            .filter((titre) => !!titre)[0] ?? titreActif;

        liensActifs.forEach((lien) => lien.parentElement!.classList.remove('actif'));

        if (titreAActiver) {
          const liens = contenu.querySelectorAll<HTMLElement>(`.sommaire ul li a[href='#${titreAActiver.id}']`);
          liens.forEach((lien) => lien.parentElement!.classList.add('actif'));

          const menuMobileVisible = contenu.querySelector('#section-active');
          if (menuMobileVisible) menuMobileVisible.textContent = titreAActiver.textContent;

          titreActif = titreAActiver;
        }
      },
      {
        rootMargin: '-20% 0% -80% 0%',
      }
    );
    toutesLesSections.forEach((s) => observateurDIntersection.observe(s));
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

  const propriétésFilAriane: PropriétésFilAriane | undefined = $derived(
    financement
      ? {
          parents: [
            {
              nom: 'Financements cyber',
              lien: '/financements',
            },
          ],
          feuille: financement.nom,
        }
      : undefined
  );
</script>

<Heros
  format="heros"
  cacheIllustration
  titre={financement ? financement.nom : ''}
  theme="clair"
  description={`Zone géographique éligible pour cette aide\u00a0: ${financement?.périmètresGéographiques}`}
  {propriétésFilAriane}
>
  {#snippet tags()}
    {#if financement}
      <div class="badges">
        {#each financement.typesDeFinancement as type (type)}
          <BadgeTypeFinancement {type}></BadgeTypeFinancement>
        {/each}
      </div>
    {/if}
  {/snippet}

  {#snippet actions()}
    {#if financement?.sources?.[0]}
      <div class="source">
        <Lien
          href={financement.sources[0]}
          blank
          apparence="bouton"
          type="primaire"
          taille="lg"
          libelle="Bénéficier de cette aide"
        />
      </div>
    {/if}
  {/snippet}
</Heros>

<div bind:this={contenu}>
  {#if financement}
    {#if entreesMenuFinancement}
      <MenuFinancement
        dictionnaireAncreLibelle={entreesMenuFinancement}
        mode="mobile"
        tags={financement.entitésÉligibles}
      />
    {/if}

    <dsfr-container class="corps">
      <div class="contenu-section">
        {#if entreesMenuFinancement}
          <MenuFinancement
            dictionnaireAncreLibelle={entreesMenuFinancement}
            mode="desktop"
            tags={financement.entitésÉligibles}
          />
        {/if}
        <div class="fiche">
          <div class="financePar">
            <p>Financé par&nbsp;: <strong>{financement.financeur}</strong></p>
          </div>
          <SectionDetailsFinancement ancre="objectifs" titre="Objectifs" detail={financement.objectifs} />
          <SectionDetailsFinancement
            ancre="operations-eligibles"
            titre="Opérations éligibles"
            detail={financement.opérationsÉligibles}
          />

          <SectionDetailsFinancement ancre="beneficiaires" titre="Bénéficiaires" detail={financement.bénéficiaires} />

          <SectionDetailsFinancement ancre="montant" titre="Montant" detail={financement.montant} />

          <SectionDetailsFinancement ancre="conditions" titre="Conditions" detail={financement.condition} />
          {#if financement?.sources?.[0]}
            <Lien
              href={financement.sources[0]}
              blank
              apparence="bouton"
              type="primaire"
              libelle="Bénéficier de cette aide"
            />
          {/if}
          <Lien href="#" libelle="Haut de page" icone="arrow-up-fill" />
          <p class="note-information texte-mention-xs">
            Nous vous recommandons de vous adresser directement aux organismes gestionnaires mentionnés dans la fiche
            pour déterminer si votre projet est éligible à une aide. Enfin, si vous notez des omissions ou des erreurs
            dans cette fiche, merci de nous adresser vos remarques en nous contactant sur le <Lien
              href="https://aide.messervices.cyber.gouv.fr/fr/?chat=ouvert"
              libelle="chat"
              neutre
            ></Lien>
          </p>
        </div>
      </div>
    </dsfr-container>
  {/if}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  dsfr-container {
    padding: 0 0 40px;
  }

  .badges {
    display: flex;
    align-items: flex-start;
    align-content: flex-start;
    gap: 0.5rem;
    align-self: stretch;
    flex-wrap: wrap;
    margin-top: 1.5rem;
  }

  .corps {
    padding: 3rem 0 4.5rem;

    .contenu-section {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      align-self: stretch;

      .fiche {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 0 0;
        gap: 2rem;
      }
    }
  }
</style>
