<script lang="ts">
  import { DsfrBadge, DsfrCard } from '@lab-anssi/ui-kit';
  import RetourUtilisateurSurContenu from '../../../../../../ui/RetourUtilisateurSurContenu.svelte';
  import IllustrationOutil from './IllustrationOutil.svelte';

  type Props = {
    href: string;
    identifiant: string;
    taille: string;
    titre: string;
    typeFichier: 'ICS' | 'XLSX';
  };
  const { identifiant, href, taille, titre, typeFichier }: Props = $props();
  const src = $derived(
    `/assets/images/parcours-securisation/outils/icone-telechargement-${typeFichier.toLowerCase()}.svg`
  );
</script>

<div class="outil">
  <DsfrCard
    title={titre}
    size="sm"
    horizontal
    download
    {href}
    enlarge
    hasHeaderBadge
    hasDetailEnd
    detailEnd={`${typeFichier} - ${taille}`}
  >
    <div slot="headerbadges" class="fr-badges-group">
      <DsfrBadge label="Outil sécurisation" type="accent" accent="green-emeraude" size="sm"></DsfrBadge>
    </div>
    <div slot="image" class="image-outil">
      <IllustrationOutil illustration={src} />
    </div>
  </DsfrCard>
  <RetourUtilisateurSurContenu identifiantCible={identifiant} typeDeRetour="outil" mode="carte">
    <b>Cet outil vous a-t-il aidé&#8239;?</b>
  </RetourUtilisateurSurContenu>
</div>

<style lang="scss">
  .image-outil {
    height: 100%;
  }

  .outil {
    display: flex;
    flex-direction: column;
  }
</style>
