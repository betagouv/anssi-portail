<script lang="ts">
  import RetourUtilisateurSurContenu from '../../../../../../ui/RetourUtilisateurSurContenu.svelte';

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
  <dsfr-card
    title={titre}
    size="sm"
    horizontal="true"
    download="true"
    {href}
    enlarge="true"
    has-badge="true"
    {src}
    has-header-badge
    has-detail-end
    detail-end={`${typeFichier} - ${taille}`}
  >
    <div slot="headerbadges">
      <dsfr-badge label="Outil sécurisation" type="accent" accent="green-emeraude" size="sm"></dsfr-badge>
    </div>
  </dsfr-card>
  <RetourUtilisateurSurContenu identifiantCible={identifiant} typeDeRetour="outil" mode="carte">
    <b>Cet outil vous a-t-il aidé&nbsp;?</b>
  </RetourUtilisateurSurContenu>
</div>

<style lang="scss">
  .outil {
    display: flex;
    flex-direction: column;

    dsfr-card {
      min-height: auto;
    }
  }
</style>
