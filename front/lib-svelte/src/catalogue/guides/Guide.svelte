<script lang="ts">
  import { guideZeroTrust } from '../../../test/catalogue/stores/objetsExemples';
  import FilAriane from '../../ui/FilAriane.svelte';
  import { aseptiseHtml } from '../../utils/aseptisationDuHtml';
  import type { Guide } from '../Guide.types';

  const guide: Guide = {
    ...guideZeroTrust,
    illustration: '/assets/images/image-generique.avif',
  };
  const aDesCollections = guide.collections.length > 0;
  const descriptionAspetisee = aseptiseHtml(guide.description);
</script>

<section class="chapeau">
  <div class="contenu-section">
    <FilAriane
      branche={{ nom: 'Catalogue cyber', lien: '/catalogue' }}
      feuille={guide.nom}
    />
    <div class="resume">
      <div>
        <h1>{guide.nom}</h1>
        <a href="/" target="_blank" class="bouton primaire">
          Télecharger le guide
        </a>
      </div>
      <div class="conteneur-illustration">
        <img src={guide.illustration} alt="Capture d’écran" />
      </div>
    </div>
  </div>
</section>

<div class="sommaire sommaire-replie">
  <details>
    <summary>
      <div class="entete-filtres">
        <img class="menu" src="/assets/images/icone-menu-lateral.svg" alt="" />
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
      <section class="presentation" id="presentation">
        <h2>Présentation</h2>
        <!-- On affiche des données provenant d'une source interne -->
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html descriptionAspetisee}

        <img src={guide.illustration} alt="Capture d’écran" />

        <a href="/" target="_blank" class="bouton primaire">
          Télecharger le guide
        </a>
      </section>

      {#if aDesCollections}
        <section class="collections" id="collection">
          <h2>Dans la même collection</h2>
        </section>
      {/if}

      <div class="haut-de-page">
        <a href="#haut-de-page" class="lien">Haut de page</a>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive.scss' as *;

  .chapeau {
    background: #f4f4f4 url('/assets/images/motif-fond-service.png');
    padding: 24px var(--gouttiere);

    .contenu-section {
      display: flex;
      flex-direction: column;
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
        max-width: 588px;
        @include a-partir-de(xxl) {
          display: block;
        }
      }
    }

    h1 {
      margin: 8px 0 16px;
      font-size: 2.5rem;
      line-height: 2.875rem;

      @include a-partir-de(md) {
        font-size: 3.5rem;
        line-height: 4.125rem;
      }
    }

    .bouton {
      margin-top: 24px;
      margin-bottom: 40px;
      padding: 10px 28px;

      @include a-partir-de(md) {
        width: fit-content;
      }
    }
  }

  .article {
    padding: 40px var(--gouttiere) 0;

    @include a-partir-de(lg) {
      padding-top: 48px;
    }

    .contenu-section {
      display: flex;
      flex-direction: column;

      @include a-partir-de(lg) {
        flex-direction: row;
        gap: 32px;
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

    img {
      width: 100%;
      margin-top: 2rem;

      @include a-partir-de(xxl) {
        display: none;
      }
    }

    .bouton {
      margin-top: 32px;
      margin-bottom: 0;
      padding: 10px 24px;

      @include a-partir-de(lg) {
        width: fit-content;
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
    margin: 0 auto 40px;
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
