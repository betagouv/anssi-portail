<script lang="ts">
  import { afficheBadgeCyberdépart } from '$plateforme/environnement';
  import Lien, { type Props as PropsDuLien } from '../../ui/Lien.svelte';

  type Props = {
    taille?: PropsDuLien['taille'];
  };

  const { taille }: Props = $props();

  const libelléCta = afficheBadgeCyberdépart ? 'Télécharger mon attestation' : 'Télécharger les visuels';
  const urlBouton = afficheBadgeCyberdépart
    ? '/api/cyberdepart/attestation_badge_cyberdepart.zip'
    : '/api/cyberdepart/visuels_cyberdepart.zip';
</script>

<Lien
  apparence="bouton"
  libelle={libelléCta}
  type="secondaire"
  {taille}
  icone="download-line"
  iconeADroite={false}
  href={urlBouton}
  etire
/>
