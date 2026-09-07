<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import {
    FACTEURS_AGGRAVANTS,
    secteurDisponiblePour,
    SECTEURS,
    TYPES_ORGANISATION,
    type FacteurAggravant,
    type ReponsesExposition,
    type Secteur,
    type TypeOrganisation,
  } from './expositionCyberattaques';

  interface Props {
    onevaluer: (reponses: ReponsesExposition) => void;
  }

  let { onevaluer }: Props = $props();

  let type: TypeOrganisation | undefined = $state();
  let secteur = $state('');
  let facteurs: FacteurAggravant[] = $state([]);

  const radiosType = TYPES_ORGANISATION.map(({ value, label }) => ({ id: `type-${value}`, label, value }));
  const optionsSecteur = SECTEURS.map(({ value, label }) => ({ value, label }));
  const checkboxesFacteurs = FACTEURS_AGGRAVANTS.map(({ value, label }) => ({ id: `facteur-${value}`, label, value }));

  const secteurDisponible = $derived(secteurDisponiblePour(type));
  const indiceSecteur = $derived(
    secteurDisponible
      ? "Facultatif, mais affine l'évaluation"
      : 'Disponible uniquement pour les TPE / PME / ETI et les grands groupes'
  );

  $effect(() => {
    if (!secteurDisponible) secteur = '';
  });

  const choisitType = (evenement: CustomEvent<string>) => {
    type = evenement.detail as TypeOrganisation;
  };

  const choisitSecteur = (evenement: CustomEvent<string>) => {
    secteur = evenement.detail;
  };

  const choisitFacteurs = (evenement: CustomEvent<string[]>) => {
    facteurs = evenement.detail as FacteurAggravant[];
  };

  const valide = () => {
    if (!type) return;
    onevaluer({ type, secteur: (secteur || undefined) as Secteur | undefined, facteurs });
  };
</script>

<div class="formulaire-exposition">
  <div class="section section--profil">
    <div class="entete">
      <lab-anssi-icone nom="building-line" taille="lg"></lab-anssi-icone>
      <h2>Profil de votre organisation</h2>
    </div>

    <dsfr-radios-group
      id="type-organisation"
      name="type-organisation"
      legend="Type d'organisation"
      rich
      radios={enPropriétéWebC(radiosType)}
      onvaluechanged={choisitType}
    ></dsfr-radios-group>

    <dsfr-select
      id="secteur-activite"
      label="Secteur d'activité"
      hint={indiceSecteur}
      placeholder="Sélectionner une option"
      disabled={!secteurDisponible}
      value={secteur}
      options={enPropriétéWebC(optionsSecteur)}
      onvaluechanged={choisitSecteur}
    ></dsfr-select>
  </div>

  <div class="section section--facteurs">
    <div class="entete">
      <lab-anssi-icone nom="crosshair-2-line" taille="lg"></lab-anssi-icone>
      <h2>Facteurs aggravants d’exposition</h2>
    </div>

    <dsfr-checkboxes-group
      id="facteurs-aggravants"
      legend="Sélectionnez un ou plusieurs facteurs aggravants"
      checkboxes={enPropriétéWebC(checkboxesFacteurs)}
      onvalueschanged={choisitFacteurs}
    ></dsfr-checkboxes-group>
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <dsfr-button label="Évaluer mon exposition" kind="primary" size="lg" disabled={!type} onclick={valide}></dsfr-button>

  <p class="mention">
    Strictement indicatif. Ce simulateur mesure des facteurs d'exposition à l'appui de cas de cyberattaques signalés en
    2025 à l'ANSSI (Panorama de la cybermenace) et à Cybermalveillance.gouv.fr (rapport d'activité). Il ne préjuge en
    rien de la probabilité de survenue d'une cyberattaque pour une organisation particulière, celle-ci dépendant de
    plusieurs facteurs, dont son niveau de maturité cyber.
  </p>
</div>

<style lang="scss">
  .formulaire-exposition {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin: 0 auto;
    max-width: 36.75rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2.5rem;
    width: 100%;

    &--profil {
      background-color: var(--background-alt-pink-macaron);
    }

    &--facteurs {
      background-color: var(--background-alt-blue-france);
    }
  }

  .entete {
    align-items: center;
    display: flex;
    gap: 1rem;

    h2 {
      margin-bottom: 0;
    }
  }

  dsfr-button {
    width: 100%;
  }

  .mention {
    color: var(--text-mention-grey);
    font-size: 0.75rem;
    line-height: 1.25rem;
    margin-bottom: 0;
    text-align: center;
  }
</style>
