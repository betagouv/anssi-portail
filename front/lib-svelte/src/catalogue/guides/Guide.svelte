<script lang="ts">
  import { onMount } from 'svelte';
  import FilAriane from '../../ui/FilAriane.svelte';
  import { aseptiseHtml } from '../../utils/aseptisationDuHtml';
  import type { Guide } from '../Guide.types';
  import BadgesDeCollections from './BadgesDeCollections.svelte';
  import BoutonsDocumentsGuide from './BoutonsDocumentsGuide.svelte';
  import { decodeEntitesHtml } from './guide';
  import ListeGuideMemeCollection from './ListeGuideMemeCollection.svelte';
  import BoutonFavori from '../../favoris/BoutonFavori.svelte';
  import {
    chargeGuidesDansLeStore,
    guidesStore,
  } from '../stores/guides/guides.store';

  let guide: Guide | undefined;
  onMount(async () => {
    const slug = window.location.href.split('/').at(-1);
    await chargeGuidesDansLeStore();
    guide = $guidesStore.find((g) => g.id === `/guides/${slug}`);
  });
  $: aDesCollections = guide && guide.collections.length > 0;
  $: descriptionAspetisee = aseptiseHtml(guide?.description ?? '');
</script>

{#if guide}
  <section class="chapeau">
    <div class="contenu-section">
      <FilAriane
        branche={{ nom: 'Catalogue cyber', lien: '/catalogue' }}
        feuille={guide.nom}
      />
      <div class="badges-collections">
        <BadgesDeCollections {guide} />
      </div>
      <div class="resume">
        <div>
          <h1>{decodeEntitesHtml(guide.nom)}</h1>
          <BoutonsDocumentsGuide {guide} />
        </div>
        <div class="conteneur-illustration">
          <img src={guide.illustration.grande} alt="Capture d’écran" />
        </div>
      </div>
    </div>
  </section>

  <div class="sommaire sommaire-replie">
    <details>
      <summary>
        <div class="entete-filtres">
          <img
            class="menu"
            src="/assets/images/icone-menu-lateral.svg"
            alt=""
          />
          <span id="section-active" class="titre-menu">Présentation</span>
          <img
            class="chevron"
            src="/assets/images/icone-chevron-bas.svg"
            alt=""
          />
        </div>
      </summary>

      <ul>
        <li class="actif">
          <a href="#presentation">Présentation</a>
        </li>
        {#if aDesCollections}
          <li><a href="#collection">Dans la même collection</a></li>
        {/if}
      </ul>
    </details>
  </div>

  <div class="article">
    <div class="contenu-section">
      <div class="sommaire sommaire-deplie">
        <ul>
          <li class="actif">
            <a href="#presentation">Présentation</a>
          </li>
          {#if aDesCollections}
            <li><a href="#collection">Dans la même collection</a></li>
          {/if}
        </ul>
        <span>TAGS</span>
        <div class="labels">
          <span>ANSSI</span>
        </div>
      </div>

      <div class="contenu">
        <div class="favori">
          <BoutonFavori idItem={guide.id} />
        </div>
        <p class="dates">
          Publié le {guide.datePublication} &bullet; Mis à jour le {guide.dateMiseAJour}
        </p>
        <section class="presentation" id="presentation">
          <h2>Présentation</h2>
          <!-- On affiche des données provenant d'une source interne -->
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html descriptionAspetisee}

          <div class="grille-cartes">
            <img src={guide.illustration.grande} alt="Capture d’écran" />
          </div>

          <BoutonsDocumentsGuide {guide} autoriseMultiple />
        </section>

        {#if aDesCollections}
          <section class="collections" id="collection">
            <h2>Dans la même collection</h2>
            <ListeGuideMemeCollection {guide} />
          </section>
        {/if}

        <div class="haut-de-page">
          <a href="#haut-de-page" class="lien">Haut de page</a>
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../../assets/styles/responsive.scss' as *;

  .chapeau {
    background: #f4f4f4 url('/assets/images/motif-fond-service.png');
    padding: 24px var(--gouttiere);

    .contenu-section {
      display: flex;
      flex-direction: column;

      .badges-collections {
        margin-top: 24px;
      }
    }

    @include a-partir-de(xxl) {
      padding-bottom: 0;
    }

    .resume {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      gap: 24px;

      @include a-partir-de(xxl) {
        flex-direction: row;
      }

      .conteneur-illustration {
        display: flex;
        flex-direction: column-reverse;
      }

      img {
        display: none;
        width: 588px;
        object-fit: cover;
        object-position: top;
        height: 330px;
        background-color: white;

        @include a-partir-de(xxl) {
          display: block;
        }
      }
    }

    h1 {
      margin: 0 0 16px;
      font-size: 2.5rem;
      line-height: 2.875rem;

      @include a-partir-de(md) {
        font-size: 3.5rem;
        line-height: 4.125rem;
      }
    }
  }

  .article {
    padding: 24px var(--gouttiere) 0;

    @include a-partir-de(lg) {
      padding-top: 32px;
    }

    .contenu-section {
      display: flex;
      flex-direction: column;

      @include a-partir-de(lg) {
        flex-direction: row;
        gap: 32px;
      }

      .contenu {
        .favori {
          display: flex;
          justify-content: flex-end;
        }

        .dates {
          font-size: 0.75rem;
          line-height: 1.25rem;
          color: #666;
          margin-block: 0 32px;
        }

        .presentation {
          :global(a:not(.bouton)) {
            display: inline;
            text-decoration: underline;
            -webkit-text-decoration: underline;

            &:hover {
              text-decoration-thickness: 2px;
            }
            &:after {
              display: none;
            }
          }
        }
      }
    }
  }

  .sommaire-replie {
    details {
      ul {
        list-style-type: none;
        padding: 0;

        li {
          border-bottom: 1px solid #ddd;
          padding-top: 12px;
          padding-bottom: 12px;

          &.actif {
            background: #fff7db;

            a {
              border-left: 2px solid var(--jaune-msc);
              padding-left: 14px;
              border-bottom: none;
            }
          }

          a {
            text-decoration: none;
            color: var(--noir);
            padding-left: 16px;
            display: inline-block;
            border-bottom: none;
          }
        }
      }
    }
  }

  .sommaire-deplie {
    display: none;
    width: 300px;
    flex: 0 0 auto;
    align-self: flex-start;
    padding-top: 8px;

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
        padding-top: 12px;
        padding-bottom: 12px;

        &.actif {
          font-weight: bold;

          a {
            border-left: 2px solid var(--jaune-msc);
            padding-left: 6px;
          }
        }

        a {
          border-bottom: none;
          text-decoration: none;
          color: var(--noir);
          padding-left: 8px;
          display: inline-block;
        }
      }
    }

    span {
      margin-bottom: 16px;
      font-size: 0.85rem;
      line-height: 1.5rem;
    }
  }

  .presentation {
    padding: 0 0 8px;

    @include a-partir-de(xxl) {
      padding-top: 0;
      h2 {
        margin-top: 0;
      }
    }
    .grille-cartes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(273px, 1fr));
      gap: 24px;

      img {
        width: 100%;
        margin-top: 32px;
        margin-bottom: 8px;
      }
    }
  }

  h2 {
    margin: 32px 0;
    padding: 0;
    font-size: 1.5rem;
    line-height: 1.875rem;

    @include a-partir-de(md) {
      font-size: 2rem;
      line-height: 2.5rem;
    }
  }

  .haut-de-page {
    margin: 48px auto 40px;
    text-align: center;

    @include a-partir-de(md) {
      text-align: left;
    }

    a {
      &:before {
        content: '';
        background: url('/assets/images/icone-fleche-pleine.svg');
        width: 16px;
        height: 16px;
        margin-left: auto;
      }
    }
  }
</style>
