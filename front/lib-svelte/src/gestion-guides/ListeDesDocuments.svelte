<script lang="ts">
  import axios from 'axios';
  import { clic } from '../directives/actions.svelte';

  export type Document = {
    libelle: string;
    nomFichier: string;
    chemin?: string;
  };

  type Props = {
    identifiantGuide: string;
    nouveauxDocuments: Document[];
  };

  let { identifiantGuide = $bindable(), nouveauxDocuments = $bindable() }: Props = $props();

  let documentsDeLApi = $state<Document[]>([]);
  let succes: boolean = $state(false);
  let erreur = $state('');

  const chargeLesDocumentsDepuisGrist = async () => {
    documentsDeLApi = [];
    if (identifiantGuide === '') return;
    const reponse = await axios.get(`/api/guides/${identifiantGuide}/documents`);
    documentsDeLApi = reponse.data;
    nouveauxDocuments = [];
  };

  const supprimeLeDocument = async (nomFichier: string) => {
    try {
      await axios.delete(`/api/guides/${identifiantGuide}/documents/${nomFichier}`);
      await chargeLesDocumentsDepuisGrist();
      succes = true;
      erreur = '';
    } catch (error) {
      console.error('Erreur lors de la suppression du document :', error);
      succes = false;
      erreur = 'Erreur lors de la suppression du document';
    }
  };

  $effect(() => {
    if (identifiantGuide) {
      chargeLesDocumentsDepuisGrist();
    } else {
      documentsDeLApi = [];
    }
  });

  $effect(() => {
    const resetAlerte = () =>
      setTimeout(() => {
        succes = false;
        erreur = '';
      }, 15000);
    if (succes || erreur) {
      const timer = resetAlerte();
      return () => clearTimeout(timer);
    }
  });
</script>

<div class="documents">
  <h3>Documents associés</h3>
  {#if succes}
    <dsfr-alert type="success" size="sm" title="Document en cours de suppression" dismissible>
      <p slot="description">Vous pouvez ajouter un autre document ou continuer votre navigation sur le site.</p>
    </dsfr-alert>
  {:else if erreur}
    <dsfr-alert type="error" size="sm" title="Erreur lors de la suppression du document" dismissible>
      <p slot="description">{erreur}</p>
    </dsfr-alert>
  {/if}
  {#if identifiantGuide}
    {#each documentsDeLApi as { libelle, nomFichier, chemin }, id (id)}
      <div class="document">
        <p>
          <dsfr-link href={chemin} blank label={nomFichier}></dsfr-link>
        </p>
        <p>{libelle}</p>
        <dsfr-button
          class="supprimer"
          type="button"
          size="md"
          kind="tertiary"
          label="Supprimer"
          has-icon="true"
          icon="delete-bin-line"
          use:clic={() => supprimeLeDocument(nomFichier)}
        ></dsfr-button>
      </div>
    {/each}
    {#each nouveauxDocuments as { libelle, nomFichier }, id (id)}
      <div class="document">
        <p>
          <dsfr-link href="#" blank label={nomFichier}></dsfr-link>
        </p>
        <p>{libelle}</p>
        <dsfr-button disabled class="supprimer" type="button" size="md" kind="tertiary" label="Ajout en cours"
        ></dsfr-button>
      </div>
    {/each}
  {:else}
    <p>Sélectionnez un guide pour voir les documents associés</p>
  {/if}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .documents {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 16px 0;
    max-width: taille-pour-colonnes(8);
    margin: auto;
  }

  h3,
  p {
    margin: 0;
  }

  .document {
    display: grid;

    p:first-of-type {
      font-weight: bold;
    }

    @include a-partir-de(lg) {
      align-items: start;
      grid-template-columns: 1fr auto;
      grid-template-rows: 1fr fr;
      gap: 16px;

      dsfr-button {
        grid-column: 2;
        grid-row: 1 / span 2;
      }
    }
  }
</style>
