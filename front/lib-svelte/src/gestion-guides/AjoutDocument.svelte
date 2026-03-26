<script lang="ts">
  import axios from 'axios';
  import { clic } from '../directives/actions.svelte';
  import SelectionIdentifiantGuide from './SelectionIdentifiantGuide.svelte';

  let nouveauDocument: File | undefined = $state(undefined);
  let libelleDuLien: string = $state('');
  let identifiantGuide: string = $state('');
  let succes: boolean = $state(false);

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
      identifiantGuide = '';
      libelleDuLien = '';
      nouveauDocument = undefined;
      succes = true;
    }
  };
</script>

<dsfr-container>
  <div class="formulaire-ajout">
    <h2>Ajout d'un document de guide</h2>
    {#if succes}
      <dsfr-alert type="success" size="sm" hasTitle={false} dismissible>
        <p slot="description">Document ajouté avec succès.</p>
        <p slot="description">
          Vous pouvez ajouter un autre document ou continuer votre navigation
          sur le site.
        </p>
      </dsfr-alert>
    {/if}
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
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/grille' as *;

  .formulaire-ajout {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 72px 0;
    max-width: taille-pour-colonnes(8);
    margin: auto;
  }
</style>
