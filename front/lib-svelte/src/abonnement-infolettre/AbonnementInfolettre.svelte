<script lang="ts">
  import { clic } from '../directives/actions.svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Formulaire from '../ui/Formulaire.svelte';

  let mail: string | null = null;
  let infolettreAcceptee = false;
  let erreurValidation = false;
  let formulaireEnvoye = false;

  const soumetsFormulaire = () => {
    if (!infolettreAcceptee || !mail) {
      erreurValidation = true;
      return;
    }
    console.log('envoi du formulaire');
    formulaireEnvoye = true;
  };

  const adresseRetour = new URLSearchParams(window.location.search).get(
    'adresseRetour'
  );

  let adresseRetourNettoyee: string | null;
  if (adresseRetour) {
    let adresseParsee =
      URL.parse(adresseRetour) ||
      URL.parse(adresseRetour, window.location.origin);

    adresseRetourNettoyee = adresseParsee
      ? adresseParsee.pathname + adresseParsee.search + adresseParsee.hash
      : null;
  }
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

      {#if formulaireEnvoye}
        <div class="confirmation">
          <dsfr-alert type="info" size="sm" title="Une dernière étape">
            <p slot="description">
              Un e-mail de confirmation vous a été envoyé. Consultez votre boîte
              de réception pour confirmer votre abonnement à la newsletter.
            </p>
          </dsfr-alert>
          <img
            src="/assets/images/dragon-coeur-entier.svg"
            alt="Le dragon vous remercie"
          />
          <dsfr-button
            markup="a"
            label="Revenir à l’étape précédente"
            kind="secondary"
            hasIcon
            iconPlace="left"
            icon="arrow-go-back-line"
            href={adresseRetourNettoyee}
          ></dsfr-button>
        </div>
      {:else}
        <dsfr-input
          id="email-infolettre"
          label="Adresse email"
          errorMessage="Cette information est obligatoire."
          hint="Exemple&nbsp;: nom@exemple.fr"
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
      {/if}
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

  .confirmation {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    img {
      max-width: 340px;
      align-self: center;
    }
  }
</style>
