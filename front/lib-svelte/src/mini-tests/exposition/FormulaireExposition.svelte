<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { publieRéponseQuestionnaireExposition } from '../../passerelles/mini-tests/publicationRéponses';
  import Bouton from '../../ui/Bouton.svelte';
  import {
    type FacteurAggravant,
    FACTEURS_AGGRAVANTS,
    type ReponsesExposition,
    type Secteur,
    secteurDisponiblePour,
    SECTEURS,
    type TypeOrganisation,
    TYPES_ORGANISATION,
  } from './expositionCyberattaques';

  interface Props {
    onévaluer: (reponses: ReponsesExposition) => void;
  }

  let { onévaluer }: Props = $props();

  let typeOrganisation: TypeOrganisation | undefined = $state();
  let secteur: Secteur | undefined = $state();
  let facteurs: FacteurAggravant[] = $state([]);

  const radiosType = TYPES_ORGANISATION.map(({ value, label }) => ({ id: `type-${value}`, label, value }));
  const optionsSecteur = SECTEURS.map(({ value, label }) => ({ value, label }));
  const caseÀCocherFacteurs = FACTEURS_AGGRAVANTS.map(({ value, label }) => ({ id: `facteur-${value}`, label, value }));

  const secteurDisponible = $derived(secteurDisponiblePour(typeOrganisation));
  const indiceSecteur = $derived(
    secteurDisponible
      ? "Facultatif, mais affine l'évaluation"
      : 'Disponible uniquement pour les TPE / PME / ETI et les grands groupes'
  );

  $effect(() => {
    if (!secteurDisponible) secteur = undefined;
  });

  const choisisType = (evenement: CustomEvent<string>) => {
    typeOrganisation = evenement.detail as TypeOrganisation;
  };

  const choisisSecteur = (evenement: CustomEvent<string>) => {
    secteur = (evenement.detail || undefined) as Secteur | undefined;
  };

  const choisisFacteurs = (evenement: CustomEvent<string[]>) => {
    facteurs = evenement.detail as FacteurAggravant[];
  };

  const valide = async () => {
    if (!typeOrganisation) return;
    onévaluer({ type: typeOrganisation, secteur, facteurs });
    await publieRéponseQuestionnaireExposition({ facteursAggravant: facteurs, typeOrganisation, secteur });
  };
</script>

<dsfr-container>
  <div class="formulaire-exposition">
    <div class="section section--profil">
      <div class="entete">
        <lab-anssi-icone nom="building-line" taille="lg"></lab-anssi-icone>
        <h2 class="texte-chapo-xl">Profil de votre organisation</h2>
      </div>

      <dsfr-radios-group
        id="type-organisation"
        name="type-organisation"
        legend="Type d'organisation"
        rich
        radios={enPropriétéWebC(radiosType)}
        onvaluechanged={choisisType}
      ></dsfr-radios-group>

      <dsfr-select
        id="secteur-activite"
        label="Secteur d'activité"
        hint={indiceSecteur}
        placeholder="Sélectionner une option"
        disabled={!secteurDisponible}
        value={secteur ?? ''}
        options={enPropriétéWebC(optionsSecteur)}
        onvaluechanged={choisisSecteur}
      ></dsfr-select>
    </div>

    <div class="section section--facteurs">
      <div class="entete">
        <lab-anssi-icone nom="crosshair-2-line" taille="lg"></lab-anssi-icone>
        <h2 class="texte-chapo-xl">Facteurs aggravants d’exposition</h2>
      </div>

      <dsfr-checkboxes-group
        id="facteurs-aggravants"
        legend="Sélectionnez un ou plusieurs facteurs aggravants"
        checkboxes={enPropriétéWebC(caseÀCocherFacteurs)}
        onvalueschanged={choisisFacteurs}
      ></dsfr-checkboxes-group>
    </div>

    <Bouton libelle="Évaluer mon exposition" surClic={valide} taille="lg" desactive={!typeOrganisation} />

    <p class="texte-mention-xs">
      Strictement indicatif. Ce simulateur mesure des facteurs d'exposition à l'appui de cas de cyberattaques signalés
      en 2025 à l'ANSSI (Panorama de la cybermenace) et à Cybermalveillance.gouv.fr (rapport d'activité). Il ne préjuge
      en rien de la probabilité de survenue d'une cyberattaque pour une organisation particulière, celle-ci dépendant de
      plusieurs facteurs, dont son niveau de maturité cyber.
    </p>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  dsfr-container {
    display: block;
    padding-bottom: 4rem;
    padding-top: 3.5rem;
  }

  .formulaire-exposition {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 0 auto;
    align-items: center;

    @include a-partir-de(md) {
      max-width: taille-pour-colonnes(10);
    }

    @include a-partir-de(xl) {
      max-width: taille-pour-colonnes(6);
    }
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2.5rem;
    width: 100%;
    box-sizing: border-box;

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

    lab-anssi-icone {
      color: var(--artwork-major-blue-france);
    }

    h2 {
      margin-bottom: 0;
    }
  }

  .texte-mention-xs {
    margin-bottom: 0;
  }
</style>
