<script lang="ts">
  import axios, { AxiosError } from 'axios';
  import { clic } from '../directives/actions.svelte';
  import SelectionIdentifiantGuide from './SelectionIdentifiantGuide.svelte';

  type Document = { libelle: string; nomFichier: string };

  let nouveauDocument: File | undefined = $state(undefined);
  let libelleDuLien: string = $state('');
  let identifiantGuide: string = $state('');
  let succes: boolean = $state(false);
  let erreur = $state('');
  let fichier = $state<HTMLInputElement | undefined>();
  let genereVisuel: boolean = $state(false);
  let documents = $state<Document[]>([]);

  const surAjoutDocument = async (event: Event): Promise<void> => {
    const target = event.target as HTMLInputElement;
    nouveauDocument = target.files?.[0];
  };

  const ajoute = async () => {
    const formulaire = new FormData();
    if (nouveauDocument) {
      formulaire.append('libelleDuLien', libelleDuLien);
      formulaire.append('genereVisuel', genereVisuel ? 'true' : 'false');
      formulaire.append('document-guide', nouveauDocument);
      try {
        await axios.post(
          `/api/guides/${identifiantGuide}/documents`,
          formulaire
        );
        identifiantGuide = '';
        libelleDuLien = '';
        nouveauDocument = undefined;
        genereVisuel = false;
        succes = true;
        erreur = '';
        if (fichier) {
          fichier.value = '';
        }
      } catch (error: unknown) {
        succes = false;
        const erreurAxios = error as AxiosError;
        if (erreurAxios.response) {
          const data = erreurAxios.response.data as { erreur: string };
          if (Array.isArray(data)) {
            erreur =
              data[0]?.message ||
              "Une erreur est survenue lors de l'ajout du document";
          } else {
            erreur = data.erreur;
          }
        } else {
          erreur = erreurAxios.message;
        }
      }
    }
  };

  const chargeLesDocumentsDepuisGrist = async () => {
    const reponse = await axios.get(
      `/api/guides/${identifiantGuide}/documents`
    );
    documents = reponse.data;
  };

  $effect(() => {
    if (identifiantGuide) {
      chargeLesDocumentsDepuisGrist();
    } else {
      documents = [];
    }
  });
</script>

<dsfr-container>
  <div class="guide">
    <h2>Guide</h2>
    <SelectionIdentifiantGuide bind:valeur={identifiantGuide} />
  </div>
  <div class="documents">
    <h3>Documents associés</h3>
    {#if identifiantGuide}
      <ul>
        {#each documents as document (document.nomFichier)}
          <li>
            <h6 class="fichier">{document.nomFichier}</h6>
            <span class="libelle">{document.libelle}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p>Sélectionnez un guide pour voir les documents associés</p>
    {/if}
  </div>
  <div class="formulaire-ajout">
    <h3>Ajout d'un nouveau document</h3>
    {#if succes}
      <dsfr-alert
        type="success"
        size="sm"
        title="Document ajouté avec succès"
        dismissible
      >
        <p slot="description">
          Vous pouvez ajouter un autre document ou continuer votre navigation
          sur le site.
        </p>
      </dsfr-alert>
    {:else if erreur}
      <dsfr-alert
        type="error"
        size="sm"
        title="Erreur lors de l'ajout du document"
        dismissible
      >
        <p slot="description">{erreur}</p>
      </dsfr-alert>
    {/if}
    <input
      bind:this={fichier}
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
    <dsfr-checkbox
      id="genereVisuel"
      label="Générer un visuel à partir du PDF (uniquement si le document est un PDF)"
      value={genereVisuel}
      onvaluechanged={(e: CustomEvent) => (genereVisuel = e.detail)}
    ></dsfr-checkbox>
    <dsfr-button
      label="Ajouter"
      use:clic={ajoute}
      disabled={!nouveauDocument || !libelleDuLien || !identifiantGuide}
    ></dsfr-button>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/grille' as *;

  .guide,
  .documents,
  .formulaire-ajout {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 16px 0;
    max-width: taille-pour-colonnes(8);
    margin: auto;
  }

  .guide {
    padding: 72px 0 16px;
  }

  .formulaire-ajout {
    padding: 16px 0 72px;
  }

  h2,
  h3,
  p {
    margin: 0;
  }

  .fichier {
    margin: 0;
  }
</style>
