<script lang="ts">
  import axios from 'axios';
  import { clic } from '../directives/actions.svelte';
  import SelectionIdentifiantGuide from './SelectionIdentifiantGuide.svelte';

  let nouveauDocument: File | undefined = $state(undefined);
  let libelleDuLien: string = $state('');
  let identifiantGuide: string = $state('');

  const surAjoutDocument = async (event: Event): Promise<void> => {
    const target = event.target as HTMLInputElement;
    nouveauDocument = target.files?.[0];
  };

  const ajoute = async () => {
    const formulaire = new FormData();
    if (nouveauDocument) {
      formulaire.append('libelleDuLien', libelleDuLien);
      formulaire.append('document-guide', nouveauDocument);
      await axios.post(`/api/guides/${identifiantGuide}/documents`, formulaire);
    }
  };
</script>

<dsfr-container>
  <SelectionIdentifiantGuide bind:valeur={identifiantGuide} />
  <input
    type="file"
    id="document-guide"
    name="document-guide"
    oninput={surAjoutDocument}
  />
  <dsfr-input
    id="libelleDuLien"
    label="Libellé du lien"
    onvaluechanged={(e: CustomEvent) => (libelleDuLien = e.detail)}
    value={libelleDuLien}
  ></dsfr-input>
  <dsfr-button
    label="Ajouter"
    use:clic={ajoute}
    disabled={!nouveauDocument || !libelleDuLien || !identifiantGuide}
  ></dsfr-button>
</dsfr-container>
