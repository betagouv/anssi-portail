<script lang="ts">
  import ChampTexte from '../ui/ChampTexte.svelte';
  import Bouton from '../ui/Bouton.svelte';
  import axios from 'axios';
  import Icone from '../ui/Icone.svelte';
  import SelectionOrganisation from '../ui/formulaire/SelectionOrganisation.svelte';
  import type { OrganisationDisponible } from '../ui/formulaire/SelectionOrganisation.types';
  import Formulaire from '../ui/Formulaire.svelte';
  import ControleFormulaire from '../ui/ControleFormulaire.svelte';
  import { validationChamp } from '../directives/validationChamp';

  let formulaireDemandeAide: Formulaire;
  let formulaireSoumis: boolean;

  let entite: OrganisationDisponible;
  let email: string;
  let estEnRelationAvecUnUtilisateur: boolean;
  let emailUtilisateur: string;
  let cguSontValidees: boolean;
  let enCoursEnvoi = false;

  const soumetsFormulaire = async () => {
    formulaireSoumis = true;

    if (!formulaireDemandeAide.estValide()) return;

    try {
      enCoursEnvoi = true;
      await axios.post('/api/mon-aide-cyber/demandes-aide', { email });
    } finally {
      enCoursEnvoi = false;
    }
  };
</script>

<article class="page-demande-aide-mon-aide-cyber">
  <section class="encart-presentation">
    <div class="contenu-section">
      <a href="/" class="lien"><Icone type="fleche-gauche" />Retour</a>
    </div>
    <div class="contenu-section grille-deux-colonnes">
      <div>
        <h2>
          Vous souhaitez vous protéger contre les cyberattaques mais ne savez
          pas comment vous y prendre ?
        </h2>
        <p>
          <b>Prenez votre cyberpdépart !</b> Bénéficiez d’un
          <b
            >premier diagnostic gratuit accompagné d’un Aidant de la communauté
            MonAideCyber</b
          >
          et commencez à renforcer rapidement le niveau de cybersécurité de votre
          organisation.
        </p>
        <div class="zone-tags">
          <span class="tag">
            <Icone type="check" /> Dans vos locaux
          </span>
          <span class="tag">
            <Icone type="check" />
            Rapide (1h30)</span
          >
          <span class="tag"> <Icone type="check" /> Anonyme</span>
        </div>
        <p>
          <i
            >Ce diagnostic proposé par l'État n'est pas adapté aux particuliers
            et micro-entreprises.</i
          >
        </p>
      </div>
      <img
        class="illustration dragon-cyberdepart"
        src="/assets/images/illustration-cyberdepart.svg"
        alt="Illustration Cyberdepart"
      />
    </div>
  </section>
  <section class="contenu-section zone-formulaire">
    <Formulaire classe="carte-formulaire" bind:this={formulaireDemandeAide}>
      <div class="champ">
        <label class="libelle" for="entite">Recherchez votre organisation</label
        >
        <SelectionOrganisation
          bind:valeur={entite}
          filtreDepartement={undefined}
        />
        {#if entite}
          <div>Votre entreprise : {entite.nom} ({entite.departement})</div>
        {/if}
      </div>

      {#if entite}
        <div class="champ">
          <ControleFormulaire requis={true} libelle="Email de contact">
            <ChampTexte
              id="email"
              nom="email"
              type="email"
              aideSaisie="Ex : jean.dupont@mail.com"
              requis={true}
              bind:valeur={email}
              messageErreur="Le format du mail est invalide"
            />
          </ControleFormulaire>
        </div>

        <div class="champ champ-radios">
          <ControleFormulaire
            requis
            libelle="Êtes-vous déjà en contact avec un Aidant cyber ou un prestataire ?"
          >
            <div>
              <label>
                <input
                  name="estEnRelationAvecUnUtilisateur"
                  type="radio"
                  bind:group={estEnRelationAvecUnUtilisateur}
                  value={false}
                />
                <span>Non</span>
              </label>
              <label>
                <input
                  name="estEnRelationAvecUnUtilisateur"
                  type="radio"
                  bind:group={estEnRelationAvecUnUtilisateur}
                  value={true}
                />
                <span>Oui</span>
              </label>
            </div>
            {#if estEnRelationAvecUnUtilisateur === undefined && formulaireSoumis}
              <span class="erreur-champ-saisie"
                >Ce champ est obligatoire. Veuillez le cocher.</span
              >
            {/if}
          </ControleFormulaire>
        </div>

        {#if estEnRelationAvecUnUtilisateur}
          <div class="champ">
            <ControleFormulaire
              requis={true}
              libelle="Email de l'Aidant ou du prestataire"
            >
              <ChampTexte
                bind:valeur={emailUtilisateur}
                nom="emailUtilisateur"
                id="emailUtilisateur"
                requis={true}
                aideSaisie="Ex: jean.dupont@email.com"
                messageErreur="Le format du mail est invalide"
              />
            </ControleFormulaire>
          </div>
        {/if}

        <div class="case-a-cocher cgu">
          <input
            type="checkbox"
            required
            bind:checked={cguSontValidees}
            use:validationChamp={'Ce champ est obligatoire. Veuillez le cocher.'}
          />
          <label for="cguAcceptees" class="requis">
            J'accepte les conditions générales d'utilisation de MesServicesCyber
            au nom de l’entité que je représente.
          </label>
        </div>

        <Bouton
          type="primaire"
          titre="Envoyer ma demande de diagnostic"
          on:click={soumetsFormulaire}
          {enCoursEnvoi}
        />
      {/if}
    </Formulaire>
  </section>
</article>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  h2 {
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: var(--Typographie-Titres-H2---LG-Interlignage, 36px);
  }

  p {
    font-size: 18px;
    font-style: normal;
    line-height: 28px;
  }

  .encart-presentation {
    padding: var(--gouttiere) var(--gouttiere) 52px var(--gouttiere);

    background-color: var(--controle-segmente-courant-fond);

    .grille-deux-colonnes {
      display: grid;
      grid-template-columns: 1fr;

      .dragon-cyberdepart {
        display: none;
      }
      img {
        overflow: auto;
      }
    }
  }

  :global(.zone-formulaire) {
    width: auto;
    max-width: 100%;
    padding: var(--gouttiere);

    @include a-partir-de(md) {
      padding-left: 64px;
      padding-right: 64px;
    }
  }

  :global(.carte-formulaire) {
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid
      var(--Couleurs-Clair-Decisions-Border-_border-default-grey, #ddd);
    background: #fff;
    padding: 48px 24px 72px 24px;

    margin-top: -50px;

    display: flex;
    flex-direction: column;
    gap: 32px;

    @include a-partir-de(md) {
      padding: 48px 80px 72px 80px;
    }

    .libelle {
      font-size: 20px;
      font-weight: bold;
    }

    .champ {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .champ.champ-radios {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .erreur-champ-saisie {
        display: flex;
      }
    }
  }

  .zone-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  span.tag {
    background: var(--jaune-jaune-primaire, #fed980);
    color: var(--noir);
    font-weight: 700;
    border-radius: 999px;
    padding: 4px 12px;

    display: flex;
    align-items: center;
    gap: 4px;
  }

  input[type='checkbox'] {
    appearance: none;
    border: 1px solid var(--noir);
    border-radius: 4px;
    width: 24px;
    height: 24px;
    margin: 0;
    cursor: pointer;

    &:checked {
      background-color: var(--jaune-msc);

      &::before {
        content: '';
        display: block;
        margin: auto;
        width: 6px;
        height: 12px;
        border-right: 2px var(--noir) solid;
        border-bottom: 2px var(--noir) solid;
        transform: translateY(2px) rotate(0.12turn);
      }
    }

    &:indeterminate {
      /* Ce style est prévu pour être cumulatif avec l'état coché */
      &::before {
        width: 9px;
        height: 10px;
        border-right: none;
        transform: none;
      }
    }
  }
</style>
