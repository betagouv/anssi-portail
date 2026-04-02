<script lang="ts">
  import { clic } from '../directives/actions.svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Formulaire from '../ui/Formulaire.svelte';

  let mail: string | null = null;
  let infolettreAcceptee = false;
  let erreurValidation = false;

  const soumetsFormulaire = () => {
    if (!infolettreAcceptee || !mail) {
      erreurValidation = true;
      return;
    }
    console.log('envoi du formulaire');
  };
</script>

<dsfr-container>
  <FilAriane feuille="Newsletter MesServicesCyber" />

  <Formulaire>
    <div class="formulaire">
      <hgroup>
        <h2>
          <lab-anssi-icone nom="mail-line" taille="lg"
          ></lab-anssi-icone>Abonnement à la newsletter
        </h2>
        <p class="texte-standard-md">
          Directive NIS 2, guides de l’ANSSI : recevez gratuitement toute
          l’actualité de MesServicesCyber.
        </p>
      </hgroup>

      <dsfr-input
        id="email-infolettre"
        label="Adresse email"
        errorMessage="Cette information est obligatoire."
        hint="Exemple : nom@exemple.fr"
        value={mail}
        onvaluechanged={(e: CustomEvent) => (mail = e.detail)}
        status={mail || !erreurValidation ? 'default' : 'error'}
        required
      ></dsfr-input>

      <dsfr-checkbox
        id="acceptation-infolettre"
        name="acceptation-infolettre"
        errorMessage="Cette information est obligatoire."
        hint="La politique de confidentialité est disponible ici."
        value={infolettreAcceptee}
        onvaluechanged={(e: CustomEvent) => (infolettreAcceptee = e.detail)}
        status={infolettreAcceptee || !erreurValidation ? 'default' : 'error'}
        required
      >
        <span>J'accepte de recevoir la newsletter de MesServicesCyber.</span>
      </dsfr-checkbox>

      <dsfr-button
        label="S'abonner à la newsletter"
        kind="primary"
        type="submit"
        use:clic={soumetsFormulaire}
      ></dsfr-button>
    </div>
  </Formulaire>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  dsfr-button {
    align-self: center;
  }

  dsfr-container {
    padding: 1rem 0 3rem;
  }

  .formulaire {
    background-color: var(--background-alt-blue-france);
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-top: 1.5rem;
    padding: 3.5rem 1rem;

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
      margin-left: auto;
      margin-right: auto;
    }

    .texte-standard-md {
      margin-bottom: 0;
    }
  }

  h2 {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;

    @include a-partir-de(md) {
      flex-direction: row;
    }
  }
</style>
