<script lang="ts">
  import axios from 'axios';
  import Bouton from '../../ui/Bouton.svelte';
  import type { PropriétésFilAriane } from '../../ui/filAriane';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import RetourUtilisateurSurContenu from '../../ui/RetourUtilisateurSurContenu.svelte';
  import IllustrationHerosKitSensibilisation from './animation/IllustrationHerosKitSensibilisation.svelte';
  import {
    récupèreArchiveGénérique,
    récupèreArchivePersonnalisée,
    téléchargeFichierDansNavigateur,
  } from './manipulationZip';
  import Thématique from './Thematique.svelte';
  import { thématiques } from './thematiques';

  let _aperçuEnCours = $state(false);
  let logo = $state<File | null>(null);
  let _pdfs: Uint8Array<ArrayBuffer>[] = $state([]);
  let générationEnCours = $state(false);

  $effect(() => {
    logo;
    cacheArchive = null;
  });

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Kit de sensibilisation interne' };

  let cacheArchive: Uint8Array<ArrayBuffer> | null = $state(null);
  const génèreArchivePersonnalisée = async (): Promise<Uint8Array<ArrayBuffer>> => {
    if (cacheArchive) {
      return cacheArchive;
    }

    try {
      générationEnCours = true;
      const { data } = await axios.get<ArrayBuffer>('/api/outils/kit-de-sensibilisation-interne', {
        responseType: 'arraybuffer',
      });

      if (logo) {
        [cacheArchive, _pdfs] = await récupèreArchivePersonnalisée(data, logo);
      } else {
        cacheArchive = récupèreArchiveGénérique(data);
      }
    } finally {
      générationEnCours = false;
    }
    return cacheArchive;
  };

  const téléchargeLeKit = async () => {
    const archive = await génèreArchivePersonnalisée();
    téléchargeFichierDansNavigateur(archive, 'ANSSI-kit-sensibilisation.zip');
  };

  const prévisualiser = async () => {
    _aperçuEnCours = true;
    await génèreArchivePersonnalisée();
  };
</script>

<HerosRiche
  description="Un plan de sensibilisation avec 6 thématiques (affiches et courriels) à déployer au rythme de votre organisation. L’ordre proposé suit une progression logique."
  {propriétésFilAriane}
  titre="Kit de sensibilisation interne"
  variante="bleu-clair"
>
  {#snippet illustration()}
    <IllustrationHerosKitSensibilisation />
  {/snippet}
</HerosRiche>

<dsfr-container>
  <div class="encart">
    <div class="section-gauche">
      <h2 class="fr-h5">6 affiches prêtes à imprimer et des courriels prêts à copier</h2>
      <div class="choix-fichier">
        <p>Ajouter votre logo aux affiches (facultatif)</p>
        <p class="texte-mention-xs">
          Format supportés&nbsp;: JPG, PNG. Poids&nbsp;: 2 Mo max. Traité dans votre navigateur, jamais envoyé.
        </p>
        <input
          type="file"
          id="couverture"
          name="couverture"
          accept="image/jpeg, image/png, image/jpg"
          onchange={(e) => (logo = e.currentTarget.files?.[0] ?? null)}
        />
      </div>
      <div class="actions">
        <Bouton
          desactive={générationEnCours}
          icone="download-line"
          libelle="Télécharger le kit"
          surClic={téléchargeLeKit}
        />
        {#if logo}
          <Bouton
            type="secondaire"
            icone="eye-line"
            libelle="Afficher l'aperçu"
            titre="Prévisualiser"
            surClic={prévisualiser}
          />
        {/if}
      </div>
    </div>
    <div class="section-droite">
      <img src="/assets/images/kit-de-sensibilisation/apercu-encart.svg" alt="" />
    </div>
  </div>

  <div class="contenu-kit">
    <h2 class="fr-h4">Contenu du kit</h2>
    <div class="thématiques">
      {#each thématiques as thématique (thématique.titre)}
        <Thématique
          titre={thématique.titre}
          cheminAperçu={thématique.cheminAperçu}
          titreEmail={thématique.titreEmail}
          description={thématique.description}
        />
      {/each}
    </div>
  </div>

  <RetourUtilisateurSurContenu identifiantCible="kit-de-sensibilisation-interne" typeDeRetour="outil">
    <p class="texte-article-lg">Ce contenu vous a-t-il aidé&nbsp;?</p>
  </RetourUtilisateurSurContenu>
</dsfr-container>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  dsfr-container {
    padding-bottom: 3.5rem;

    .encart {
      display: grid;
      width: 100%;
      margin-top: 3rem;
      grid-template-columns: 1fr;

      @include a-partir-de(sm) {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
      }

      border: 1px solid var(--border-default-grey, #ddd);
      background: var(--background-raised-grey, #fff);

      .section-gauche {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        gap: 1.5rem;

        h2 {
          margin-bottom: 0;
        }

        .choix-fichier {
          > :first-child {
            margin: 0 0 0.75rem;
          }
          > :nth-child(2) {
            margin: 0 0 1rem;
          }
        }

        .actions {
          display: flex;
          flex-wrap: wrap-reverse;
          gap: 1rem;
        }
      }

      .section-droite {
        display: none;

        @include a-partir-de(sm) {
          display: flex;
          justify-content: center;
          background-color: var(--background-alt-beige-gris-galet, #f9f6f2);
        }
      }
    }

    .contenu-kit {
      margin-top: 2rem;
      margin-bottom: 1rem;

      @include a-partir-de(md) {
        margin-bottom: 2rem;
      }

      h2 {
        margin-bottom: 2rem;
      }

      .thématiques {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        @include a-partir-de(md) {
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        @include a-partir-de(lg) {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }

    .texte-article-lg {
      font-weight: bold;
      margin-bottom: 1rem;
    }
  }
</style>
