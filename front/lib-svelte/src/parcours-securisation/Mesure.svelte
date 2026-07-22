<script lang="ts">
  import { aseptiseHtml } from '$plateforme/aseptisationDuHtml';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import CelluleExigenceNis2 from '../nis2/tableaux/CelluleExigenceNis2.svelte';
  import Accordeon from '../ui/Accordeon.svelte';
  import Bouton from '../ui/Bouton.svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import { storeAvisUtilisateur, type AvisUtilisateur } from './avisUtilisateur.store';
  import type { Mesure } from './mesure';
  import PriseEnCompteMesure from './PriseEnCompteMesure.svelte';
  import InterlocuteursParcoursSecurisation from './InterlocuteursParcoursSecurisation.svelte';
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
  const avisUtilisateur: AvisUtilisateur | undefined = $derived(idMesure ? $storeAvisUtilisateur[idMesure] : undefined);

  type Etat = 'Soumis' | 'AfficheCommentaire' | undefined;
  let etat = $state<Etat>(undefined);
  let commentaire: string = $state('');

  const soumetsAvisPositif = async () => {
    if (!idMesure) return;
    if ($storeAvisUtilisateur[idMesure]?.positif === true) {
      storeAvisUtilisateur.supprimeAvis(idMesure);
    } else {
      await soumetsAvisUtilisateur(true);
    }
  };

  const soumetsAvisNegatif = async (commentaire: string) => {
    await soumetsAvisUtilisateur(false, commentaire);
  };

  let time: number;
  const soumetsAvisUtilisateur = async (retour: boolean, commentaire?: string) => {
    if (!idMesure) return;
    storeAvisUtilisateur.ajouteAvis(idMesure, { positif: retour });
    await axios.post(`/api/mesures/${idMesure}/avis`, {
      retour: retour ? 'POSITIF' : 'NEGATIF',
      ...(!retour && { commentaire }),
    });
    etat = 'Soumis';
    time = window.setTimeout(() => {
      etat = undefined;
    }, 5000);
  };

  const afficheCommentaire = () => {
    if (!idMesure) return;
    clearTimeout(time);

    if (idMesure in $storeAvisUtilisateur && !$storeAvisUtilisateur[idMesure]) {
      storeAvisUtilisateur.supprimeAvis(idMesure);
      etat = undefined;
    } else {
      storeAvisUtilisateur.ajouteAvis(idMesure, { positif: false });
      etat = 'AfficheCommentaire';
    }
  };
</script>

{#if mesure}
  <Heros
    cacheActions={true}
    cacheIllustration={false}
    cacheTags={true}
    description={mesure.titre}
    illustrationSource="/assets/images/parcours-securisation/mesure-{mesure.id}.svg"
    illustrationAlt=""
    format="details"
    titre={mesure.phraseAccroche}
    theme="clair"
  >
    {#snippet filAriane()}
      <FilAriane
        feuille={mesure?.phraseAccroche ?? ''}
        branche={{
          nom: 'Protéger mon organisation',
          lien: '/',
        }}
      ></FilAriane>
    {/snippet}
  </Heros>

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
              <h3 slot="title">Bonne nouvelle&nbsp;!</h3>
              <p slot="text">{mesure.actionFacileAFaire}</p>
            </dsfr-highlight>
          {/if}
        </div>

        <TutorielMesure {mesure} />
        <div class="contenu-section avis-utilisateur">
          <div class="section-aide retour">
            <div class="texte-information-avis-utilisateur">
              <span class="titre-avis"><b>Ce contenu vous a-t-il aidé ?</b></span>
            </div>
            <div class="conteneur-emoji-avis">
              <Bouton
                type="tertiaire"
                iconeSeule
                icone="thumb-up-line"
                titre="Réponse positive"
                actif={avisUtilisateur?.positif}
                surClic={() => soumetsAvisPositif()}
              ></Bouton>
              <Bouton
                type="tertiaire"
                iconeSeule
                icone="thumb-down-line"
                titre="Réponse négative"
                actif={avisUtilisateur && !avisUtilisateur.positif}
                surClic={() => afficheCommentaire()}
              ></Bouton>
            </div>
            {#if etat === 'AfficheCommentaire'}
              <div class="encart-commentaire-avis">
                <dsfr-textarea
                  label="Aidez-nous à améliorer le contenu de cette page"
                  placeholder="Indiquez ce qu'il vous a manqué, ce qui n'était pas clair ou ce qui pourrait être amélioré."
                  type="text"
                  nom="avis"
                  rows="1"
                  maxlength="1000"
                  onvaluechanged={(e: CustomEvent<string>) => {
                    commentaire = e.detail;
                  }}
                ></dsfr-textarea>
                <div class="conteneur-bouton">
                  <Bouton
                    type="primaire"
                    libelle="Envoyer vos commentaires"
                    surClic={() => soumetsAvisNegatif(commentaire)}
                  ></Bouton>
                </div>
              </div>
            {/if}
            {#if etat === 'Soumis'}
              <dsfr-alert type="success" size="sm">
                <span slot="description">Merci&nbsp;! Vos retours sont précieux. ✨</span>
              </dsfr-alert>
            {/if}
          </div>
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
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

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

      &.retour .texte-information-avis-utilisateur {
        margin-bottom: 1rem;
      }

      dsfr-alert,
      .encart-commentaire-avis {
        margin-top: 1.5rem;
      }

      .encart-commentaire-avis {
        background-color: var(--background-contrast-beige-gris-galet);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.5rem;

        .conteneur-bouton {
          margin-top: 1rem;
        }
      }
    }

    .recyf > p {
      margin-bottom: 1.5rem;
    }
  }
</style>
