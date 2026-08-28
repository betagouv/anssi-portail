<script lang="ts">
  import { aseptiseHtml } from '$plateforme/aseptisationDuHtml';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import CelluleExigenceNis2 from '../../nis2/tableaux/CelluleExigenceNis2.svelte';
  import { profilStore } from '../../stores/profil.store';
  import Accordeon from '../../ui/Accordeon.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../../ui/filAriane';
  import Heros from '../../ui/Heros.svelte';
  import RetourUtilisateurSurContenu from '../../ui/RetourUtilisateurSurContenu.svelte';
  import InterlocuteursParcoursSecurisation from './../InterlocuteursParcoursSecurisation.svelte';
  import type { Mesure } from './../mesure';
  import PriseEnCompteMesure from './../PriseEnCompteMesure.svelte';
  import TutorielMesure from './TutorielMesure.svelte';

  let mesure: Mesure | undefined = $state();

  onMount(async () => {
    const chemin = new URL(window.location.href).pathname;
    const idMesureACharger = chemin.split('/').reverse()[0];
    const reponse = await axios.get<Mesure>(`/api/mesures/${idMesureACharger}`);
    mesure = reponse.data;
  });

  let explications = $derived(mesure ? aseptiseHtml(mesure.explications) : '');
  let actionPrioritaire = $derived(mesure ? aseptiseHtml(mesure.actionPrioritaire) : '');
  let exigencesTrieesParObjectif = $derived(
    mesure
      ? mesure.exigences.toSorted((a, b) =>
          a.objectifSecurite.localeCompare(b.objectifSecurite, 'fr', { sensitivity: 'base' })
        )
      : []
  );
  let exigencesRegroupeesParObjectif = $derived(
    mesure ? Object.groupBy(exigencesTrieesParObjectif, ({ objectifSecurite }) => objectifSecurite) : {}
  );

  const idMesure = $derived(mesure?.id);

  const titre = $derived(mesure ? mesure.phraseAccroche || mesure.titre : '');
  const description = $derived(mesure && mesure.phraseAccroche ? mesure.titre : '');
  const propriétésFilAriane: PropriétésFilAriane = $derived(
    mesure
      ? [
          {
            nom: 'Protéger mon organisation',
            lien:
              $profilStore?.parcoursSecurisation.parcoursActuel === 'allégé'
                ? `/modules/${mesure.idModule}`
                : '/parcours-complet',
          },
          ...($profilStore?.parcoursSecurisation.parcoursActuel === 'allégé'
            ? [] // pas de sous-branche en parcours allégé
            : [
                {
                  nom: mesure.nomModule,
                  lien: `/modules/${mesure.idModule}`,
                },
              ]),
          {
            nom: titre,
          },
        ]
      : []
  );
</script>

{#if mesure}
  <Heros
    {description}
    illustrationSource="/assets/images/parcours-securisation/mesure-{mesure.id}.avif"
    illustrationAlt=""
    format="details"
    {titre}
    theme="clair"
    segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
  />

  <dsfr-container>
    <div class="article">
      <div class="prise-en-compte">
        <PriseEnCompteMesure {mesure} />
      </div>
      <div class="contenu-principal">
        <div class="contenu-section">
          <h2>Présentation</h2>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html explications}
        </div>

        <div class="contenu-section">
          <h2>Les risques évités</h2>
          <ul class="risques-list">
            {#each mesure.risques as risque (risque.libelle)}
              <li>
                <strong>{risque.libelle}&nbsp;:</strong>
                {risque.description}
              </li>
            {/each}
          </ul>
        </div>

        <div class="contenu-section priorites">
          <h2><lab-anssi-icone nom="arrow-right-line"></lab-anssi-icone>À faire en priorité</h2>
          <div>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            <p>{@html actionPrioritaire}</p>
          </div>
          {#if mesure.actionFacileAFaire}
            <dsfr-highlight size="md" text="slot">
              <h3 class="fr-h5" slot="title">Bonne nouvelle&nbsp;!</h3>
              <p slot="text">{mesure.actionFacileAFaire}</p>
            </dsfr-highlight>
          {/if}
        </div>

        <TutorielMesure {mesure} />
        <div class="contenu-section avis-utilisateur">
          {#if idMesure}
            <RetourUtilisateurSurContenu {idMesure} />
          {/if}
          <div class="section-aide recyf">
            <p>
              Les mesures proposées sur MesServicesCyber sont inspirées du Référentiel Cyber France (ReCyF). Simplifiées
              et accompagnées d’explications pédagogiques, elles contribuent à faciliter les efforts de sécurisation de
              toutes les organisations, notamment celles concernées par la directive NIS2.
            </p>
            <p>Pour approfondir, consultez la ou les exigences ReCyF/NIS2 dont est inspirée cette mesure.</p>
            {#each Object.entries(exigencesRegroupeesParObjectif) as [objectif, exigences], index (index)}
              <Accordeon libelle={objectif}>
                {#each exigences as exigence (exigence.reference)}
                  <CelluleExigenceNis2 {exigence} />
                  <hr />
                {/each}
              </Accordeon>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </dsfr-container>
  <InterlocuteursParcoursSecurisation />
{:else}
  <dsfr-container>Chargement... </dsfr-container>
{/if}

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  * {
    box-sizing: border-box;
  }

  dsfr-container {
    padding-block: 2rem 3.5rem;

    @include a-partir-de(md) {
      padding-top: 2.5rem;
    }
  }

  .article {
    @include a-partir-de(md) {
      display: grid;
      grid-template-columns: auto taille-pour-colonnes(4);
    }
    @include a-partir-de(lg) {
      grid-template-columns: auto taille-pour-colonnes(3);
    }

    .prise-en-compte {
      order: 2;
    }
  }

  .contenu-section {
    margin-bottom: 2rem;

    ul {
      padding-left: 1.75rem;
    }

    &.priorites {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 2rem;
      background-color: var(--background-alt-blue-cumulus);
      border-radius: 6px;

      h2 {
        margin: 0;

        lab-anssi-icone {
          margin-right: 0.5rem;
        }
      }

      h3 {
        margin: 0 0 0.5rem;
      }

      p {
        margin: 0;
      }
    }

    .section-aide {
      margin-bottom: 3rem;

      hr {
        margin-block: 1rem;
        height: 1px;
        border: 0;
        background-color: var(--border-default-grey);
        &:last-of-type {
          display: none;
        }
      }
    }

    .recyf > p {
      margin-bottom: 1.5rem;
    }
  }
</style>
