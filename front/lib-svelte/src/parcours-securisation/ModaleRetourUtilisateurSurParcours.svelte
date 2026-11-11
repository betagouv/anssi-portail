<script lang="ts">
  import { DsfrCheckbox, DsfrRadiosGroup } from '@lab-anssi/ui-kit';
  import axios from 'axios';
  import { tick } from 'svelte';
  import Bouton from '../ui/Bouton.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import Formulaire from '../ui/Formulaire.svelte';
  import Modale from '../ui/Modale.svelte';

  type Props = {
    estOuverte: boolean;
    typeDeRetour: 'spontané';
  };

  let { estOuverte = $bindable(), typeDeRetour }: Props = $props();

  const niveauxDUtilité = [
    { valeur: 1, libellé: 'Pas du tout utile', emoji: '😠' },
    { valeur: 2, libellé: 'Peu utile', emoji: '☹️' },
    { valeur: 3, libellé: 'Moyennement utile', emoji: '😕' },
    { valeur: 4, libellé: 'Utile', emoji: '😊' },
    { valeur: 5, libellé: 'Très utile', emoji: '🤩' },
  ] as const;

  const recommandations = [
    { id: 'recommandation-parcours-oui', label: 'Oui', value: 'oui' as const },
    { id: 'recommandation-parcours-peut-etre', label: 'Peut-être', value: 'peut-être' as const },
    { id: 'recommandation-parcours-non', label: 'Non', value: 'non' as const },
  ];

  type NiveauDUtilité = (typeof niveauxDUtilité)[number]['valeur'];
  type Recommandation = (typeof recommandations)[number]['value'];
  type ÉtatEnvoi = 'initial' | 'envoi' | 'erreur' | 'succès';

  let niveauDUtilité: NiveauDUtilité | undefined = $state();
  let recommandationAutreOrganisation: Recommandation | undefined = $state();
  let commentaireAmélioration = $state('');
  let souhaiteÊtreRecontacté = $state(false);
  let soumissionTentée = $state(false);
  let étatEnvoi = $state<ÉtatEnvoi>('initial');
  let confirmation: HTMLDivElement | undefined = $state();

  const erreurUtilité = $derived(soumissionTentée && !niveauDUtilité);
  const erreurRecommandation = $derived(soumissionTentée && !recommandationAutreOrganisation);
  const erreurCommentaire = $derived(soumissionTentée && !commentaireAmélioration.trim());
  const titre = $derived(
    étatEnvoi === 'succès'
      ? 'Merci 🤩\u202f! Vos remarques sont précieuses pour faire évoluer le service.'
      : 'Partagez votre expérience\u202f!'
  );

  const soumetsLeFormulaire = async () => {
    if (étatEnvoi === 'envoi') return;
    soumissionTentée = true;
    if (erreurUtilité || erreurRecommandation || erreurCommentaire) return;

    étatEnvoi = 'envoi';
    try {
      await axios.post(
        '/api/avis-parcours',
        {
          typeDeRetour,
          niveauDUtilité,
          recommandationAutreOrganisation,
          commentaireAmélioration: commentaireAmélioration.trim(),
          souhaiteÊtreRecontacté,
        },
        { params: { pageSource: window.location.pathname } }
      );
      étatEnvoi = 'succès';
      await tick();
      confirmation?.focus();
    } catch {
      étatEnvoi = 'erreur';
    }
  };
</script>

<Modale bind:estOuverte {titre}>
  {#if étatEnvoi === 'succès'}
    <div class="confirmation" bind:this={confirmation} tabindex="-1">
      <p>Si vous avez accepté d’échanger sur votre expérience, nous vous recontacterons très prochainement.</p>
    </div>
  {:else}
    <Formulaire id="formulaire-avis-parcours" surFormulaireValide={soumetsLeFormulaire}>
      <div class="contenu">
        {#if erreurUtilité || erreurRecommandation || erreurCommentaire}
          <p id="erreurs-avis-parcours" class="erreur" role="alert">
            Merci de compléter les champs avant d’envoyer votre avis.
          </p>
        {/if}
        {#if étatEnvoi === 'erreur'}
          <p class="erreur" role="alert">Votre avis n’a pas pu être envoyé. Veuillez réessayer.</p>
        {/if}

        <fieldset
          class="utilite"
          class:erreur={erreurUtilité}
          aria-describedby={erreurUtilité ? 'erreurs-avis-parcours' : undefined}
        >
          <legend>Trouvez-vous le parcours utile&#8239;?</legend>
          <div class="niveaux-utilite">
            {#each niveauxDUtilité as niveau (niveau.valeur)}
              <div class="niveau">
                <input
                  id={`utilite-parcours-${niveau.valeur}`}
                  type="radio"
                  name="utilite-parcours"
                  value={niveau.valeur}
                  aria-label={niveau.libellé}
                  bind:group={niveauDUtilité}
                />
                <label for={`utilite-parcours-${niveau.valeur}`}>
                  <span aria-hidden="true">{niveau.emoji}</span>
                </label>
              </div>
            {/each}
          </div>
          <div class="descriptions" aria-hidden="true">
            <span>Pas du tout utile</span>
            <span>Très utile</span>
          </div>
        </fieldset>

        <div class="recommandation">
          <DsfrRadiosGroup
            id="recommandation-parcours"
            name="recommandation-parcours"
            legend="Recommanderiez-vous ce parcours à une autre organisation&#8239;?"
            inline
            radios={recommandations}
            value={recommandationAutreOrganisation}
            status={erreurRecommandation ? 'error' : 'default'}
            errorMessage="Sélectionnez une réponse."
            onvaluechanged={(valeur) => (recommandationAutreOrganisation = valeur as Recommandation)}
          />
        </div>

        <ChampTexte
          id="commentaire-avis-parcours"
          nom="commentaire-avis-parcours"
          libelle="Que pouvons-nous améliorer&#8239;?"
          tailleMaximale={8192}
          bind:valeur={commentaireAmélioration}
          statut={erreurCommentaire ? 'error' : 'default'}
          messageErreur="Renseignez un commentaire."
        />

        <DsfrCheckbox
          id="recontact-avis-parcours"
          name="recontact-avis-parcours"
          size="sm"
          label="Je souhaite être recontacté(e) pour partager mon expérience du parcours."
          bind:checked={souhaiteÊtreRecontacté}
        />
      </div>
    </Formulaire>
  {/if}

  {#snippet actions()}
    {#if étatEnvoi === 'succès'}
      <Bouton libelle="Terminer" type="tertiaire-sans-bordure" surClic={() => (estOuverte = false)} />
    {:else}
      <Bouton
        libelle="Envoyer mes commentaires"
        taille="md"
        boutonSoumission
        idFormulaire="formulaire-avis-parcours"
        desactive={étatEnvoi === 'envoi'}
      />
    {/if}
  {/snippet}
</Modale>

<style lang="scss">
  .contenu {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: var(--text-label-grey);
    font-size: 1rem;
    line-height: 1.5rem;

    .recommandation {
      margin-bottom: -2rem;
      overflow: clip;
      overflow-clip-margin: 0.25rem;
    }

    .utilite {
      min-width: 0;
      padding: 0;
      margin: 0;
      border: none;

      legend {
        padding: 0;
        margin-bottom: 0.5rem;
      }

      .niveaux-utilite {
        display: flex;
        overflow: hidden;
        border: 1px solid var(--border-action-low-blue-france);
        border-radius: 0.25rem;

        .niveau {
          position: relative;
          display: flex;
          flex: 1;
          min-width: 0;

          & + .niveau {
            border-left: 1px solid var(--border-action-low-blue-france);
          }

          input {
            position: absolute;
            width: 1px;
            height: 1px;
            opacity: 0;

            &:checked + label {
              background-color: var(--background-active-blue-france);
            }

            &:focus-visible + label {
              outline: 2px solid var(--bleu-contour-mis-en-valeur);
              outline-offset: -2px;
            }
          }

          label {
            flex: 1;
            padding: 0.5rem;
            background-color: var(--background-action-low-blue-france);
            cursor: pointer;
            text-align: center;
            font-size: 1.25rem;
            line-height: 1.5rem;

            &:hover {
              background-color: var(--background-action-low-blue-france-hover);
            }

            &:active {
              background-color: var(--background-action-low-blue-france-active);
            }
          }
        }
      }

      .descriptions {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        margin-top: 0.5rem;
        color: var(--text-mention-grey);
        font-size: 0.875rem;
      }
    }

    .erreur {
      color: var(--text-default-error);
      margin: 0;
    }
  }

  .confirmation p:last-child {
    margin-bottom: 0;
  }
</style>
