<script lang="ts">
  import BoutonFavori from '../favoris/BoutonFavori.svelte';
  import type { ItemCyber } from './Catalogue.types';
  import type { Guide } from './Guide.types';
  import HeaderBadge from './HeaderBadge.svelte';

  export let item: ItemCyber | Guide;
  export let avecBoutonFavori: boolean = false;

  const LONGUEUR_MAX_DESCRIPTION = 54;

  const estGuide = item.type === 'Guide';

  // Calcul du lien
  const lien = estGuide ? item.id : (item.lienInterne ?? (item as ItemCyber).lienExterne);
  const nouvelOnglet = !estGuide && !item.lienInterne;
  const sansLien = !lien;

  // Contenu de la carte
  const titre = estGuide ? item.nom : item.description;
  const titreCoupe = titre.length > LONGUEUR_MAX_DESCRIPTION ? titre.slice(0, LONGUEUR_MAX_DESCRIPTION) + '…' : titre;

  const image = estGuide
    ? (item as Guide).illustration.petite
    : `/assets/images/illustrations-services/${(item as ItemCyber).illustration}`;

  const altImage = estGuide ? 'Illustration du guide' : 'Illustration du service';
  const detailHaut = estGuide ? (item as Guide).thematique : item.nom;
  const detailBas = estGuide ? (item as Guide).dateMiseAJourFormatee : undefined;

  // Props analytics
  const dataSource = estGuide ? 'Guide' : 'Catalogue';
  const dataCible = item.nom;

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
    title={titreCoupe}
    hasDescription={false}
    hasDetailStart={!!detailHaut}
    detailStart={detailHaut}
    hasDetailEnd={!!detailBas || item.sources || item.tagsSpecifiques}
    detailEnd={detailBas}
    src={image}
    imageRatio="4x3"
    alt={altImage}
    href={lien}
    blank={nouvelOnglet}
    noLink={sansLien}
    hasHeaderBadge
    actionMarkup="a"
    markup="h3"
    data-source={dataSource}
    data-cible={dataCible}
  >
    <div slot="headerbadges">
      <HeaderBadge {item} libelleBadge={libelleBadge()} />
    </div>

    {#if item.sources || item.tagsSpecifiques}
      <div slot="contentend">
        {#if item.tagsSpecifiques}
          <dsfr-tags-group
            tags={item.tagsSpecifiques.map((tag) => ({ label: tag, 'has-icon': true, icon: 'government-line' }))}
            size="sm"
            groupMarkup="span"
            hasIcon
          ></dsfr-tags-group>
        {/if}
        {#if item.sources}
          <dsfr-tags-group tags={item.sources.map((source) => ({ label: source }))} size="sm" groupMarkup="span"
          ></dsfr-tags-group>
        {/if}
      </div>
    {/if}
  </dsfr-card>
  {#if avecBoutonFavori}
    <div>
      <BoutonFavori idItem={item.id} />
      Ajouter aux Favoris
    </div>
  {/if}
</div>

<style lang="scss">
  .carte-item {
    display: flex;
    flex-direction: column;
    dsfr-card {
      flex: 1;
    }
  }
</style>
