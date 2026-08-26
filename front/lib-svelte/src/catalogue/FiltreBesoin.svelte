<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { BesoinCyber } from './Catalogue.types';
  import { rechercheParBesoin } from './stores/rechercheParBesoin.store';

  interface Props {
    filtreTousVisible?: boolean;
  }

  let { filtreTousVisible = true }: Props = $props();

  const filtres = $derived([
    ...(filtreTousVisible
      ? [
          {
            libelle: 'Tous les besoins',
            valeur: null,
            icone: '<img src="/assets/images/illustration-filtre-besoins-tous.svg" alt="" width="56" height="56" />',
          },
        ]
      : []),
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
  <lab-anssi-filtres
    filtres={enPropriétéWebC(filtres)}
    valeur={$rechercheParBesoin}
    onvaleurachangee={(e: CustomEvent<string>) => ($rechercheParBesoin = (e.detail as BesoinCyber) ?? null)}
  ></lab-anssi-filtres>
</div>

<style>
  .conteneur-filtres {
    padding: 24px 0;
  }
</style>
