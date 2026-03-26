<script lang="ts">
  import axios from 'axios';
  import { clic } from '../directives/actions.svelte';

  let nouveauDocument: File | undefined = $state(undefined);

  const surAjoutDocument = async (event: Event): Promise<void> => {
    const target = event.target as HTMLInputElement;
    nouveauDocument = target.files?.[0];
  };

  const ajoute = async () => {
    const formulaire = new FormData();
    if (nouveauDocument) {
      formulaire.append('document-guide', nouveauDocument);
      await axios.post('/api/guides/xxxxxx/documents', formulaire);
    }
  };
</script>

<dsfr-container>
  <input
    type="file"
    id="document-guide"
    name="document-guide"
    oninput={surAjoutDocument}
  />
  <dsfr-button label="Ajouter" use:clic={ajoute} disabled={!nouveauDocument}
  ></dsfr-button>
</dsfr-container>
