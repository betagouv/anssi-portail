<script lang="ts">
  import FormulaireDemandeAide from './FormulaireDemandeAide.svelte';
  import type {
    CorpsAPIDemandeAide,
    DonneesFormulaireDemandeAide,
  } from './DonneesFormulaireDemandeAide';
  import axios from 'axios';
  import ConfirmationCreationDemandeAide from './ConfirmationCreationDemandeAide.svelte';
  import Icone from '../ui/Icone.svelte';

  let formulaireDemandeAide: FormulaireDemandeAide;
  let enSucces: boolean = false;
  let formulaireSoumis: boolean;
  let erreurs: string;

  let enCoursEnvoi = false;

  const soumetsFormulaire = async (
    e: CustomEvent<DonneesFormulaireDemandeAide>
  ) => {
    formulaireSoumis = true;
    if (!formulaireDemandeAide.estValide()) return;

    try {
      enCoursEnvoi = true;

      const { email, cguSontValidees, emailAidant, entite } = e.detail;
      const corps: CorpsAPIDemandeAide = {
        entiteAidee: {
          email,
          departement: entite.departement,
          raisonSociale: entite.nom,
        },
        validationCGU: cguSontValidees,
        ...(emailAidant && { emailAidant }),
      };
      const reponse = await axios.post(
        '/api/mon-aide-cyber/demandes-aide',
        corps
      );
      if (reponse.status === 201) {
        enSucces = true;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        erreurs = e.response?.data?.erreur;
      }
    } finally {
      enCoursEnvoi = false;
    }
  };
</script>

<article class="page-demande-aide-mon-aide-cyber">
  <section class="encart-presentation">
    <div class="contenu-section">
      <a href="/" class="lien"><Icone type="fleche-gauche" /> Retour</a>
    </div>
    <div class="contenu-section grille-deux-colonnes">
      <div class="colonne-explicative">
        <h2>
          Vous souhaitez vous protéger contre les cyberattaques mais ne savez
          pas comment vous y prendre ?
        </h2>
        <p>
          <b>Prenez votre cyberdépart !</b> Bénéficiez d’un
          <b
            >premier diagnostic gratuit accompagné d’un Aidant de la communauté
            MonAideCyber</b
          >
          et commencez à renforcer rapidement le niveau de cybersécurité de votre
          organisation.
        </p>
        <div class="zone-tags">
          <span class="tag"><Icone type="check" /> Dans vos locaux </span>
          <span class="tag"><Icone type="check" /> Rapide (1h30)</span>
          <span class="tag"><Icone type="check" /> Anonyme</span>
        </div>
        <p class="cible-du-diagnostic">
          Ce diagnostic proposé par l'État n'est pas adapté aux particuliers et
          micro-entreprises.
        </p>
      </div>
      <div class="colonne-illustration">
        <img
          class="illustration dragon-cyberdepart"
          src="/assets/images/illustration-cyberdepart.svg"
          alt="Illustration Cyberdepart"
        />
      </div>
    </div>
  </section>
  <section class="contenu-section zone-formulaire">
    {#if !enSucces}
      <FormulaireDemandeAide
        bind:this={formulaireDemandeAide}
        on:formulaireSoumis={soumetsFormulaire}
        {formulaireSoumis}
        {enCoursEnvoi}
        {erreurs}
      />
    {:else}
      <ConfirmationCreationDemandeAide />
    {/if}
  </section>
</article>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  h2 {
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 36px;
  }

  p {
    font-size: 18px;
    font-style: normal;
    line-height: 28px;
  }

  .lien {
    text-decoration: none;
    border-bottom: 1px solid var(--noir);
    padding-bottom: 1px;
    &:hover {
      border-bottom-width: 2px;
      padding-bottom: 0 !important;
    }
  }

  .encart-presentation {
    padding: var(--gouttiere) var(--gouttiere) 24px var(--gouttiere);

    background-color: var(--controle-segmente-courant-fond);

    .grille-deux-colonnes {
      display: grid;
      grid-template-columns: 1fr;

      @include a-partir-de(md) {
        grid-template-columns: 1fr 1fr;
      }

      .colonne-illustration {
        overflow-x: hidden;
      }

      .cible-du-diagnostic {
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem;
        margin: 0;
      }

      .dragon-cyberdepart {
        display: none;

        @include a-partir-de(md) {
          display: block;
          align-self: anchor-center;
        }

        @include a-partir-de(lg) {
          display: block;
          align-self: anchor-center;
        }
      }
    }
  }

  :global(.zone-formulaire) {
    max-width: unset;
    padding: 0 var(--gouttiere) 96px var(--gouttiere);

    background: linear-gradient(
      to bottom,
      var(--controle-segmente-courant-fond) 0px,
      var(--controle-segmente-courant-fond) 96px,
      white 0,
      white 100%
    );

    &.contenu-section {
      width: unset;
    }

    @include a-partir-de(md) {
      padding-left: 60px;
      padding-right: 60px;
    }
  }

  .zone-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 24px 0;

    .tag {
      background: var(--jaune-jaune-primaire, #fed980);
      color: var(--noir);
      font-weight: 700;
      border-radius: 999px;
      padding: 4px 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
</style>
