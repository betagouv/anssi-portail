<script lang="ts">
  import { decodeEntiteHtml } from '$plateforme/aseptisationDuHtml';
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import BoutonFavori from '../favoris/BoutonFavori.svelte';
  import type { ItemCyber } from './Catalogue.types';
  import type { Guide } from './Guide.types';
  import HeaderBadge from './HeaderBadge.svelte';

  interface Props {
    item: ItemCyber | Guide;
    avecBoutonFavori?: boolean;
  }

  let { item, avecBoutonFavori = false }: Props = $props();

  const LONGUEUR_MAX_DESCRIPTION = 54;

  const estGuide = $derived(item.type === 'Guide');

  // Calcul du lien
  const lien = $derived(estGuide ? item.id : (item.lienInterne ?? (item as ItemCyber).lienExterne));
  const nouvelOnglet = $derived(!estGuide && !item.lienInterne);
  const sansLien = $derived(!lien);

  // Contenu de la carte
  const titre = $derived((estGuide ? item.nom : item.description).replaceAll('&nbsp;', '\u00A0'));
  const titreCoupe = $derived(
    titre.length > LONGUEUR_MAX_DESCRIPTION ? titre.slice(0, LONGUEUR_MAX_DESCRIPTION) + '…' : titre
  );

  const image = $derived(
    estGuide
      ? (item as Guide).illustration.petite
      : `/assets/images/illustrations-services/${(item as ItemCyber).illustration}`
  );

  const altImage = $derived(estGuide ? 'Illustration du guide' : 'Illustration du service');
  const detailHaut = $derived(estGuide ? (item as Guide).thematique : decodeEntiteHtml(item.nom));
  const detailBas = $derived(estGuide ? (item as Guide).dateMiseAJourFormatee : undefined);

  // Props analytics
  const dataSource = $derived(estGuide ? 'Guide' : 'Catalogue');
  const dataCible = $derived(item.nom);

  // Badge de type pour ItemCyber
  const libelleBadge = () => {
    if (estGuide) return undefined;
    const itemCyber = item as ItemCyber;
    switch (itemCyber.typologie) {
      case 'service':
        return 'Service';
      case 'outil':
        return 'Outil';
      case 'contenu':
        return 'Contenu';
    }
    return undefined;
  };
</script>

<div class="carte-item">
  <dsfr-card
    actionMarkup="a"
    blank={nouvelOnglet}
    data-cible={dataCible}
    data-source={dataSource}
    detailEnd={detailBas}
    detailStart={detailHaut}
    enlarge
    hasDescription={false}
    hasDetailEnd={!!detailBas || item.sources || item.tagsSpecifiques}
    hasDetailStart={!!detailHaut}
    hasHeaderBadge
    href={lien}
    markup="h3"
    noLink={sansLien}
    size="sm"
    title={titreCoupe}
  >
    <div slot="headerbadges">
      <HeaderBadge {item} libelleBadge={libelleBadge()} />
    </div>

    {#if image}
      <img src={image} alt={altImage} slot="image" class="illustration" width="311" height="150" />
    {/if}

    <div slot="seo">
      <h3>
        <a href={lien}>{titre}</a>
      </h3>
    </div>

    {#if item.sources || item.tagsSpecifiques}
      <div slot="contentend">
        {#if item.tagsSpecifiques}
          <dsfr-tags-group
            tags={enPropriétéWebC(
              item.tagsSpecifiques.map((tag) => ({ label: tag, 'has-icon': true, icon: 'government-line' }))
            )}
            size="sm"
            groupMarkup="span"
            hasIcon
          ></dsfr-tags-group>
        {/if}
        {#if item.sources}
          <dsfr-tags-group
            tags={enPropriétéWebC(item.sources.map((source) => ({ label: source })))}
            size="sm"
            groupMarkup="span"
          ></dsfr-tags-group>
        {/if}
      </div>
    {/if}
  </dsfr-card>
  {#if avecBoutonFavori}
    <div class="encart-actions">
      <BoutonFavori idItem={item.id} avecTexte taille="sm" />
    </div>
  {/if}
</div>

<style lang="scss">
  .carte-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;

    dsfr-card {
      flex: 1;
    }

    .illustration {
      width: 100%;
      object-fit: cover;
      object-position: top;
      max-height: 150px;
    }

    .encart-actions {
      display: flex;
      border: 1px solid var(--border-default-grey);
      border-top-width: 0;
    }
  }
</style>
