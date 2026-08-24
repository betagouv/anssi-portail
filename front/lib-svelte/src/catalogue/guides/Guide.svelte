<script lang="ts">
  import { aseptiseHtml } from '$plateforme/aseptisationDuHtml';
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { onMount, untrack } from 'svelte';
  import EncartLienVersDemandeDiagnostic from '../../demande-aide-mon-aide-cyber/EncartLienVersDemandeDiagnostic.svelte';
  import { clic } from '../../directives/actions.svelte';
  import BoutonFavori from '../../favoris/BoutonFavori.svelte';
  import { profilStore } from '../../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../../ui/filAriane';
  import FilAriane from '../../ui/FilAriane.svelte';
  import Heros from '../../ui/Heros.svelte';
  import IllustrationDragonPasDeResultat from '../../ui/IllustrationDragonPasDeResultat.svelte';
  import Lien from '../../ui/Lien.svelte';
  import Separateur from '../../ui/Separateur.svelte';
  import { CollectionGuide, type Guide } from '../Guide.types';
  import { chargeGuidesDansLeStore, guidesStore } from '../stores/guides/guides.store';
  import BadgesDeCollections from './BadgesDeCollections.svelte';
  import BoutonsDocumentsGuide from './BoutonsDocumentsGuide.svelte';
  import { decodeEntitesHtml, guidePourCarteItem } from './guide';
  import InciteASAbonner from './InciteASAbonner.svelte';
  import ListeGuideMemeCollection from './ListeGuideMemeCollection.svelte';

  type Props = {
    guideInitial?: Guide;
  };

  const { guideInitial }: Props = $props();
  let itemMenuActif = $state('#presentation');

  let guide = $state<Guide | undefined>(
    untrack(() => {
      if (guideInitial) return guidePourCarteItem(guideInitial);
    })
  );
  let chargementEnCours = $state(false);

  async function copierLeLienCourt() {
    if (guide?.lienCourt) {
      await navigator.clipboard.writeText(guide?.lienCourt);
      alert('Lien copié dans le presse-papier');
    }
  }

  onMount(async () => {
    try {
      chargementEnCours = true;
      const idGuideACharger = new URL(window.location.href).pathname;
      await chargeGuidesDansLeStore();
      guide = $guidesStore.find((g) => g.id === idGuideACharger);
    } finally {
      chargementEnCours = false;
    }
  });

  onMount(() => {
    itemMenuActif = window.location.hash || '#presentation';
    const surChangementDeHash = () => {
      itemMenuActif = window.location.hash;
    };
    window.addEventListener('hashchange', surChangementDeHash);
    return () => window.removeEventListener('hashchange', surChangementDeHash);
  });

  const aDesCollections = $derived(guide && guide.collections.filter((c) => c !== CollectionGuide.AUTRE).length > 0);
  const descriptionAspetisee = $derived(aseptiseHtml(guide?.description ?? ''));
  const propriétésFilAriane: PropriétésFilAriane = $derived({
    feuille: guide?.nom ?? '',
    branche: { nom: 'Guides et ressources', lien: '/catalogue#guides' },
    fondSombre: false,
  });

  let itemsMenu = $derived([
    { id: 'presentation', label: 'Présentation', href: '#presentation', isCollapsible: 'false', type: 'link' },
    ...(aDesCollections
      ? [
          {
            id: 'collection',
            label: 'Dans la même collection',
            href: '#collection',
            isCollapsible: 'false',
            type: 'link',
          },
        ]
      : []),
  ]);
</script>

{#if guide}
  <Heros
    titre={decodeEntitesHtml(guide.nom)}
    cacheFilAriane={!!$profilStore}
    description=""
    format="details"
    segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
    theme="clair"
    illustrationSource={guide.illustration.grande}
    cacheActions={guide.documents.length !== 1}
  >
    {#snippet filAriane()}
      <FilAriane {...propriétésFilAriane} />
    {/snippet}
    {#snippet tags()}
      {#if guide}
        <div class="badges-collections">
          <BadgesDeCollections {guide} />
        </div>
      {/if}
    {/snippet}
    {#snippet illustration()}
      {#if guide}
        <div class="conteneur-illustration">
          <img src={guide.illustration.grande} width="588" height="330" alt="Capture d’écran" />
        </div>
      {/if}
    {/snippet}
    {#snippet actions()}
      {#if guide}
        <BoutonsDocumentsGuide {guide} />
      {/if}
    {/snippet}
  </Heros>

  <div class="sommaire sommaire-replie">
    <dsfr-side-menu
      active-item={itemMenuActif}
      items={enPropriétéWebC(itemsMenu)}
      button-label={itemsMenu.find((item) => `#${item.id}` === itemMenuActif)?.label ?? ''}
      button-id="sommaire-mobile"
    ></dsfr-side-menu>
  </div>

  <dsfr-container class="article">
    <div class="contenu-section">
      <div class="sommaire sommaire-deplie">
        <dsfr-side-menu
          active-item={itemMenuActif}
          items={enPropriétéWebC(itemsMenu)}
          button-label={itemsMenu.find((item) => `#${item.id}` === itemMenuActif)?.label ?? ''}
          button-id="sommaire"
        ></dsfr-side-menu>
        <div class="tags">
          <div class="contenu-tags">
            <span>TAGS</span>
            <div class="labels">
              <dsfr-tag label="ANSSI"></dsfr-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="contenu-article">
        <div class="entete">
          {#if !$profilStore}
            <div class="bandeau-infolettre">
              <InciteASAbonner />
              <Separateur />
            </div>
          {/if}
          <div class="zone-action">
            <div class="actions">
              {#if guide.lienCourt}
                <dsfr-button
                  has-icon="true"
                  icon="links-line"
                  kind="tertiary"
                  label="Copier le lien"
                  use:clic={copierLeLienCourt}
                ></dsfr-button>
              {/if}
              <BoutonFavori idItem={guide.id} avecBordure />
            </div>
            <p class="dates texte-mention-xs">
              Publié le {guide.dateMiseAJourFormatee}
            </p>
          </div>
        </div>
        <section class="presentation" id="presentation">
          <h2>Présentation</h2>
          <!-- On affiche des données provenant d'une source interne -->
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html descriptionAspetisee}

          <div class="grille-cartes">
            <img src={guide.illustration.grande} width="354" height="250" alt="Capture d’écran" />
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
          <Lien href="#haut-de-page" libelle="Haut de page" icone="arrow-up-fill"></Lien>
        </div>
      </div>
    </div>
  </dsfr-container>
  {#if guide.id === '/guides/guide-dhygiene-informatique'}
    <EncartLienVersDemandeDiagnostic />
  {/if}
{:else if !chargementEnCours}
  <dsfr-container>
    <div class="non-trouve">
      <h1>Guide introuvable</h1>
      <p>Le guide demandé n’a pas pu être trouvé.</p>
      <IllustrationDragonPasDeResultat texteAlternatif="Guide introuvable" />
    </div>
  </dsfr-container>
{/if}

<style lang="scss">
  @use '../../../../assets/styles/responsive.scss' as *;

  .conteneur-illustration {
    display: flex;
    flex-direction: column-reverse;

    img {
      display: block;
      width: 588px;
      object-fit: cover;
      object-position: top;
      height: 330px;
      background-color: var(--background-default-grey);
      max-width: 100%;
      margin-inline: auto;
    }
  }

  .badges-collections {
    margin-top: 1.5rem;
  }

  .article {
    padding: 24px 0 0;

    @include a-partir-de(md) {
      padding-top: 32px;
    }

    .contenu-section {
      display: flex;
      flex-direction: column;

      @include a-partir-de(md) {
        flex-direction: row;
        gap: 32px;
      }

      .contenu-article {
        .entete {
          display: flex;
          flex-direction: column;

          .bandeau-infolettre {
            margin-bottom: 24px;
          }

          .zone-action {
            display: flex;
            flex-direction: column;
            gap: 24px;

            @include a-partir-de(md) {
              flex-direction: row-reverse;
              justify-content: space-between;
            }
            p {
              align-self: flex-start;
              @include a-partir-de(md) {
                align-self: center;
              }
              margin: 0;
            }

            .actions {
              display: flex;
              justify-content: flex-end;
              gap: 8px;
            }
          }
        }

        .dates {
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
    z-index: calc(var(--ground) + 751);
    padding: 0;
    border: none;

    @include a-partir-de(md) {
      display: none;
    }
  }

  .sommaire-deplie {
    display: none;
    width: 300px;
    flex: 0 0 auto;
    align-self: flex-start;
    padding-top: 8px;

    @include a-partir-de(md) {
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
    }

    .tags {
      box-shadow: inset -1px 0 0 0 var(--border-default-grey);
      margin-right: 2rem;
    }

    .contenu-tags {
      display: flex;
      flex-direction: column;
      margin-top: 2rem;
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
        height: auto;
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
  }

  .non-trouve {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
