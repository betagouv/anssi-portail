<script lang="ts">
  import axios from 'axios';
  import { onDestroy, onMount, tick } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import BadgeTypeFinancement from './BadgeTypeFinancement.svelte';
  import type { Financement, ResumeFinancement } from './financement';
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

  interface Props {
    resumeFinancement: ResumeFinancement;
  }

  let { resumeFinancement }: Props = $props();
  let financement: Financement | undefined = $state();
  let detailsElement: HTMLDetailsElement | undefined = $state();

  onMount(async () => {
    try {
      const reponse = await axios.get<ReponseAxios>(
        `/api/financements/${resumeFinancement.id}`
      );
      financement = reponse.data;
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
      { rootMargin: '-30% 0% -70% 0%' }
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

  const fermeSommaire = () => {
    if (detailsElement) {
      detailsElement.open = false;
    }
  };
</script>

<section class="chapeau">
  <div class="contenu-section">
    <FilAriane
      feuille={resumeFinancement.nom}
      branche={{ nom: 'Financements cyber', lien: '/financements' }}
    />
    <div class="badges">
      {#each resumeFinancement.typesDeFinancement as type (type)}
        <BadgeTypeFinancement>{type}</BadgeTypeFinancement>
      {/each}
    </div>
    <h1>{resumeFinancement.nom}</h1>
    <p>
      {`Zone géographique éligible pour cette aide : ${resumeFinancement.perimetresGeographiques}`}
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
  <div class="sommaire sommaire-replie">
    <details bind:this={detailsElement}>
      <summary>
        <div class="entete-filtres">
          <img
            class="menu"
            src="/assets/images/icone-menu-lateral.svg"
            alt=""
          />
          <span id="section-active" class="titre-menu">Objectifs</span>
          <img
            class="chevron"
            src="/assets/images/icone-chevron-bas.svg"
            alt=""
          />
        </div>
      </summary>

      <ul>
        {#if financement?.objectifs}
          <li class="actif">
            <a href="#objectifs" onclick={fermeSommaire}>Objectifs</a>
          </li>
        {/if}
        {#if financement?.operationsEligibles}
          <li>
            <a href="#operations-eligibles" onclick={fermeSommaire}
              >Opérations éligibles</a
            >
          </li>
        {/if}
        {#if financement?.benificiaires}
          <li>
            <a href="#beneficiaires" onclick={fermeSommaire}>Bénéficiaires</a>
          </li>
        {/if}
        {#if financement?.montant}
          <li><a href="#montant" onclick={fermeSommaire}>Montant</a></li>
        {/if}
        {#if financement?.condition}
          <li><a href="#conditions" onclick={fermeSommaire}>Conditions</a></li>
        {/if}
      </ul>
    </details>
  </div>

  {#if financement}
    <section class="corps">
      <div class="contenu-section">
        <div class="sommaire sommaire-deplie">
          <ul>
            {#if financement.objectifs}
              <li class="actif">
                <a href="#objectifs">Objectifs</a>
              </li>
            {/if}
            {#if financement.operationsEligibles}
              <li>
                <a href="#operations-eligibles">Opérations éligibles</a>
              </li>
            {/if}
            {#if financement.benificiaires}
              <li>
                <a href="#beneficiaires">Bénéficiaires</a>
              </li>
            {/if}
            {#if financement.montant}
              <li>
                <a href="#montant">Montant</a>
              </li>
            {/if}
            {#if financement.condition}
              <li>
                <a href="#conditions">Conditions</a>
              </li>
            {/if}
            <p class="titreTags">tags</p>
            <div class="tags">
              {#each financement.entitesElligibles as entite (entite)}
                <lab-anssi-tag label={entite} taille="sm" type="defaut"
                ></lab-anssi-tag>
              {/each}
            </div>
          </ul>
        </div>
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

  .sommaire-replie {
    padding: 0;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background: white;
    position: sticky;
    top: 0;
    z-index: 2;

    @include a-partir-de(desktop) {
      display: none;
    }

    &:has(details[open]) {
      position: fixed;
      top: 0;
      height: 100vh;
      width: 100%;
      box-sizing: border-box;
      overflow: auto;
    }

    details {
      .entete-filtres {
        padding: 12px 16px;
        background: white;
        color: var(--sommaire-actif-couleur);
        font-size: 1rem;
        font-style: normal;
        font-weight: 500;
        line-height: 1.5rem;
      }

      ul {
        list-style-type: none;
        margin: 0;
        padding: 16px;

        li {
          border-bottom: 1px solid #ddd;
          padding-top: 12px;
          padding-bottom: 12px;

          a {
            border-left: 2px solid transparent;
            text-decoration: none;
            padding-left: 14px;
            display: inline-block;
            border-bottom: none;
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.5rem;
          }

          &.actif {
            a {
              color: var(--sommaire-actif-couleur);
              border-left-color: var(--sommaire-actif-indicateur-couleur);
            }
          }
        }
      }

      &[open] {
        summary {
          .entete-filtres {
            background: var(--sommaire-mobile-fond);

            :global(.chevron) {
              transform: rotate(180deg);
            }
          }
        }
      }

      summary {
        list-style: none;
        &::marker {
          content: '';
        }

        &::-webkit-details-marker {
          display: none;
        }

        .entete-filtres {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }

      .titre-menu {
        flex-grow: 1;
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

      .sommaire-deplie {
        display: none;
        width: 282px;
        flex: 0 0 auto;
        align-self: flex-start;

        @include a-partir-de(lg) {
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
        }

        ul {
          list-style-type: none;
          padding: 0;
          margin: 0 0 40px;

          li {
            &.actif {
              a {
                color: var(--sommaire-actif-couleur);
                border-left: 2px solid var(--sommaire-actif-indicateur-couleur);
                padding-left: 6px;
              }
            }

            a {
              width: 100%;
              border-bottom: none;
              text-decoration: none;
              padding: 12px 8px;
              display: inline-block;
              font-size: 1rem;
              font-style: normal;
              font-weight: 700;
              line-height: 1.5rem;

              &:hover {
                background: rgb(0, 0, 0, 4%);
              }

              &:active {
                background: rgb(0, 0, 0, 8%);
              }
            }
          }
        }

        span {
          margin-bottom: 16px;
          font-size: 0.85rem;
          line-height: 1.5rem;
        }

        .titreTags {
          text-transform: uppercase;
          margin-top: 40px 0 0 0;
        }

        .tags {
          display: flex;
          align-items: flex-start;
          align-content: flex-start;
          align-self: stretch;
          flex-wrap: wrap;
          margin-top: 16px 0 0 0;
          gap: 8px;
        }
      }
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
</style>
