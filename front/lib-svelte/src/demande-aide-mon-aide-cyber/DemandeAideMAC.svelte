<script lang="ts">
  import FormulaireDemandeAide from './FormulaireDemandeAide.svelte';
  import type {
    CorpsAPIDemandeAide,
    DonneesFormulaireDemandeAide,
  } from './DonneesFormulaireDemandeAide';
  import axios from 'axios';
  import ConfirmationCreationDemandeAide from './ConfirmationCreationDemandeAide.svelte';
  import Icone from '../ui/Icone.svelte';
  import { onMount } from 'svelte';
  import DialogueSortieDiagnostic from './DialogueSortieDiagnostic.svelte';

  let formulaireDemandeAide: FormulaireDemandeAide;
  let enSucces: boolean = false;
  let formulaireSoumis: boolean;
  let erreurs: string;
  let origine: string | null;

  let enCoursEnvoi = false;
  let dialogueSortie: DialogueSortieDiagnostic;

  onMount(() => {
    const parametres = new URLSearchParams(window.location.search);
    origine = parametres.get('mtm_campaign');

    const body = document.querySelector('body')!;

    const ecouteSortieSouris = (e: MouseEvent) => {
      const positionEnHauteur = e.pageY;
      if (positionEnHauteur < 250) {
        body.removeEventListener('mousemove', ecouteSortieSouris);
        localStorage.setItem('sortieDiagnosticAffichee', 'true');
        dialogueSortie.affiche();
      }
    };

    if (localStorage.getItem('sortieDiagnosticAffichee') === null) {
      setTimeout(
        () => body.addEventListener('mousemove', ecouteSortieSouris),
        7000
      );
    }
  });

  const soumetsFormulaire = async (
    e: CustomEvent<DonneesFormulaireDemandeAide>
  ) => {
    formulaireSoumis = true;
    if (!formulaireDemandeAide.estValide()) return;

    try {
      enCoursEnvoi = true;

      const {
        email,
        cguSontValidees,
        emailUtilisateurMAC,
        entite,
        identifiantAidant,
      } = e.detail;
      const corps: CorpsAPIDemandeAide = {
        ...(origine && { origine }),
        entiteAidee: {
          email,
          departement: entite.departement,
          raisonSociale: entite.nom,
          siret: entite.siret,
        },
        validationCGU: cguSontValidees,
        ...(emailUtilisateurMAC && { emailAidant: emailUtilisateurMAC }),
        ...(identifiantAidant && { identifiantAidant }),
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

<DialogueSortieDiagnostic bind:this={dialogueSortie} />

<article class="page-demande-aide-mon-aide-cyber">
  <section class="encart-presentation">
    <div class="contenu-section">
      <a href="/" class="lien">
        <Icone type="fleche-gauche" />
        Retour</a
      >
    </div>
    <div class="contenu-section">
      <div class="colonne-explicative">
        <h2>
          Vous souhaitez vous protéger contre les cyberattaques mais ne savez
          pas comment vous y prendre ?
        </h2>
        <p>
          <b>Prenez votre cyberdépart !</b> Bénéficiez d’un
          <b>premier diagnostic gratuit accompagné d’un Aidant cyber</b>
          et commencez à renforcer rapidement le niveau de cybersécurité de votre
          organisation.
        </p>
        <div class="zone-tags">
          <span class="tag"
            ><Icone type="check" /> Dans vos locaux ou en visio
          </span>
          <span class="tag"><Icone type="check" /> Rapide (1h30)</span>
          <span class="tag"><Icone type="check" /> Anonyme</span>
        </div>
        <p class="cible-du-diagnostic">
          Ce diagnostic proposé par l'État n'est pas adapté aux particuliers et
          aux entreprises mono-salariées.
        </p>
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
    background: var(--controle-segmente-courant-fond);

    @include a-partir-de(md) {
      background: var(--controle-segmente-courant-fond)
        url(/assets/images/illustration-cyberdepart.svg) no-repeat;
      background-position-x: calc(50vw + 30px);
      background-position-y: calc(50% + 30px);
    }

    .colonne-explicative {
      @include a-partir-de(md) {
        width: 50%;
        align-self: flex-start;
      }

      .cible-du-diagnostic {
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem;
        margin: 0;
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
