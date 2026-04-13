<script lang="ts">
  import AjoutDocument from './AjoutDocument.svelte';
  import ListeDesDocuments, { type Document } from './ListeDesDocuments.svelte';
  import SelectionIdentifiantGuide from './SelectionIdentifiantGuide.svelte';

  let identifiantGuide: string = $state('');
  let nouveauxDocuments = $state<Document[]>([]);

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    identifiantGuide = params.get('idGuide') ?? '';
  }

  $effect(() => {
    const params = new URLSearchParams(window.location.search);
    const guideActuel = params.get('idGuide') ?? '';
    if (identifiantGuide !== guideActuel) {
      const nouvelleUrl = identifiantGuide ? `?idGuide=${identifiantGuide}` : window.location.pathname;
      window.history.replaceState(null, '', nouvelleUrl);
    }
  });

  const surAjout = async (libelle: string, nomFichier: string) => {
    nouveauxDocuments.push({ libelle, nomFichier });
  };
</script>

<dsfr-container>
  <div class="guide">
    <h2>Rechercher un guide</h2>
    <SelectionIdentifiantGuide bind:valeur={identifiantGuide} />
  </div>
  <ListeDesDocuments {identifiantGuide} bind:nouveauxDocuments />
  <AjoutDocument {identifiantGuide} {surAjout} />
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/grille' as *;

  .guide {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 72px 0 16px;
    max-width: taille-pour-colonnes(8);
    margin: auto;
  }

  h2 {
    margin: 0;
  }
</style>
