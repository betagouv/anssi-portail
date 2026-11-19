<script lang="ts">
  import OutilTéléchargement from './patrons/OutilTelechargement.svelte';
</script>

<OutilTéléchargement
  href="/api/outils/modele-inventaire-composants-obsoletes.xlsx"
  identifiant="modele-inventaire-composants-obsoletes.xlsx"
  taille="31 Ko"
  titre="Téléchargez le modèle d’inventaire des composants obsolètes"
  typeFichier="XLSX"
  description="Un tableau prêt à remplir pour recenser vos composants obsolètes. Le statut se calcule automatiquement à partir de la date de fin de support. Un exemple rempli est fourni."
/>
