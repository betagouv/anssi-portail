<script lang="ts">
  import { FiltresCatalogue } from '@lab-anssi/ui-kit';
  import { BesoinCyber } from './Catalogue.types';
  import { rechercheParBesoin } from './stores/rechercheParBesoin.store';

  const filtres: { libelle: string; valeur: string; icone: string }[] = $derived([
    {
      libelle: 'Tous les besoins',
      valeur: BesoinCyber.TOUS,
      icone: '<img src="/assets/images/illustration-filtre-besoins-tous.svg" alt="" width="56" height="56" />',
    },
    {
      libelle: 'Être sensibilisé',
      valeur: BesoinCyber.ETRE_SENSIBILISE,
      icone: '<img src="/assets/images/illustration-filtre-besoins-sensibiliser.svg" alt="" width="56" height="56" />',
    },
    {
      libelle: 'Se former',
      valeur: BesoinCyber.SE_FORMER,
      icone: '<img src="/assets/images/illustration-filtre-besoins-former.svg" alt="" width="56" height="56" />',
    },
    {
      libelle: 'Sécuriser',
      valeur: BesoinCyber.SECURISER,
      icone: '<img src="/assets/images/illustration-filtre-besoins-securiser.svg" alt="" width="56" height="56" />',
    },
    {
      libelle: 'Réagir',
      valeur: BesoinCyber.REAGIR,
      icone: '<img src="/assets/images/illustration-filtre-besoins-reagir.svg" alt="" width="56" height="56" />',
    },
  ]);
</script>

<div class="conteneur-filtres">
  <FiltresCatalogue
    {filtres}
    elementActif={$rechercheParBesoin ?? BesoinCyber.TOUS}
    onvaleurachangee={(valeur) => {
      $rechercheParBesoin = valeur === BesoinCyber.TOUS ? null : (valeur as BesoinCyber);
    }}
  ></FiltresCatalogue>
</div>

<style>
  .conteneur-filtres {
    padding: 24px 0;
  }
</style>
