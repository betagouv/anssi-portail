<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Icone from '../ui/Icone.svelte';
  import ConfirmationCreationDemandeAide from './ConfirmationCreationDemandeAide.svelte';
  import DialogueSortieDiagnostic from './DialogueSortieDiagnostic.svelte';
  import type {
    CorpsAPIDemandeAide,
    DonneesFormulaireDemandeAide,
  } from './DonneesFormulaireDemandeAide';
  import FormulaireDemandeAide from './FormulaireDemandeAide.svelte';
  import SectionAccordeon from '../ui/SectionAccordeon.svelte';

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
      if (positionEnHauteur < 250 && !enSucces) {
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
      <lab-anssi-lien
        class="lien"
        href="/"
        titre="Retour"
        icone="arrow-go-back-line"
        positionIcone="gauche"
      ></lab-anssi-lien>
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
        </div>
        <p class="cible-du-diagnostic">
          Ce diagnostic proposé par l'État n'est pas adapté aux particuliers et
          aux entreprises mono-salariées.
        </p>
      </div>
    </div>
  </section>
  <section class="zone-formulaire">
    <div class="contenu-section">
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
    </div>
  </section>
  <section class="zone-faq">
    <div class="contenu-section">
      <h6>Questions les plus fréquences</h6>
      <div class="accordeon">
        <SectionAccordeon>
          <span slot="titre"> Mon organisation est-elle concernée ? </span>
          <div class="corps" slot="corps">
            <p>
              ✅ <strong
                >Oui, si vous êtes une TPE/PME, une collectivité, ou une
                association avec au moins deux salariés.</strong
              ><br />
              Le diagnostic s’adresse aux structures disposant d’un système d’information
              minimal (ordinateurs, messagerie, réseau partagé...).<br /><br />
            </p>
            <p>
              🚫 <strong
                >Non, si vous êtes un particulier ou mono-salarié.</strong
              ><br />
              Le diagnostic n’est pas adapté à ce profil : trop de questions ne s’appliquent
              pas, et les aidants cyber ne sont pas formés pour ce type d'accompagnement.
            </p>
          </div>
        </SectionAccordeon>
      </div>
    </div>
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

  h6 {
    margin: 0;
    margin-bottom: 24px;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.75rem;
  }

  p {
    font-size: 18px;
    font-style: normal;
    line-height: 28px;
  }

  .lien {
    display: flex;
    margin-bottom: 24px;
  }

  .encart-presentation {
    padding: var(--gouttiere) var(--gouttiere) 24px var(--gouttiere);
    background: var(--controle-segmente-courant-fond);

    @include a-partir-de(md) {
      background: var(--controle-segmente-courant-fond)
        url(/assets/images/illustration-cyberdepart.svg) no-repeat;
      background-position-x: calc(50vw + 30px);
      background-position-y: 50%;
      background-size: auto calc(100% - 48px);
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

  .zone-formulaire {
    padding: 0 var(--gouttiere) 48px var(--gouttiere);

    background: linear-gradient(
      to bottom,
      var(--controle-segmente-courant-fond) 0px,
      var(--controle-segmente-courant-fond) 96px,
      white 0,
      white 100%
    );

    .contenu-section {
      max-width: 792px;
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

  .zone-faq {
    padding: 0 var(--gouttiere) 96px var(--gouttiere);

    .contenu-section {
      max-width: 792px;
    }

    .accordeon {
      .corps {
        padding: 16px 16px 24px;

        p {
          font-size: 16px;
          line-height: 24px;
          margin: 0;
        }
      }
    }
  }
</style>
