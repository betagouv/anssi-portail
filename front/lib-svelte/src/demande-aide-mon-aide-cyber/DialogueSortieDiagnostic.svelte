<script lang="ts">
  import axios from 'axios';
  import Bouton from '../ui/Bouton.svelte';
  import BoutonFermerModale from '../ui/BoutonFermerModale.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import ZoneTexte from '../ui/ZoneTexte.svelte';

  let dialogue: HTMLDialogElement;

  export const affiche = () => {
    dialogue.showModal();
  };
  type RaisonDisponible = 'pas-clair' | 'pas-le-temps' | 'pas-besoin' | 'autre';
  let raison: RaisonDisponible | undefined;
  let precisionPasClair = '';
  let precisionPasBesoin = '';
  let precisionAutre = '';
  let emailDeContact = '';

  const recupereLaBonnePrecision = (raison?: RaisonDisponible) => {
    switch (raison) {
      case 'pas-clair':
        return precisionPasClair;
      case 'autre':
        return precisionAutre;
      case 'pas-besoin':
        return precisionPasBesoin;
      case 'pas-le-temps':
      case undefined:
        return '';
    }
  };

  const soumetsLeFormulaire = () => {
    const precision = recupereLaBonnePrecision(raison);
    axios.post('/retours-experience', { raison, precision, emailDeContact });
  };
</script>

<dialog bind:this={dialogue}>
  <form class="dialogue" on:submit={soumetsLeFormulaire}>
    <div class="contenu">
      <BoutonFermerModale on:click={() => dialogue.close()} />
      <h4>Aidez-nous à améliorer votre expérience️ 🙏&nbsp;!</h4>
      <h5>🤔 Pourquoi n’avez-vous pas finalisé votre demande&nbsp;?</h5>
      <div class="propositions">
        <label>
          <input type="radio" value="pas-clair" bind:group={raison} />
          <span>Ce n’est pas assez clair / J’aimerais en savoir plus</span>
        </label>
        {#if raison === 'pas-clair'}
          <ZoneTexte
            aideSaisie="Précisez votre réponse (facultatif)"
            bind:valeur={precisionPasClair}
          />
        {/if}
        <label>
          <input type="radio" value="pas-le-temps" bind:group={raison} />
          <span>
            Je n’ai pas le temps maintenant / Je ne suis pas décisionnaire
          </span>
        </label>
        <label>
          <input type="radio" value="pas-besoin" bind:group={raison} />
          <span>Mon organisation n’a pas besoin d’accompagnement cyber</span>
        </label>
        {#if raison === 'pas-besoin'}
          <ZoneTexte
            aideSaisie="Précisez votre réponse (facultatif)"
            bind:valeur={precisionPasBesoin}
          />
        {/if}
        <label>
          <input type="radio" value="autre" bind:group={raison} />
          <span>Autre</span>
        </label>
        {#if raison === 'autre'}
          <ZoneTexte
            aideSaisie="Précisez votre réponse (facultatif)"
            bind:valeur={precisionAutre}
          />
        {/if}
      </div>
      <div class="contact">
        <h5>📧 Une question ? Nos équipes se tiennent à votre disposition.</h5>
        <label for="email">Email de contact </label>
        <ChampTexte
          aideSaisie="Ex : jean.dupont@mail.com"
          id="email-contact"
          nom="email"
          type="email"
          bind:valeur={emailDeContact}
        />
        <p>
          Votre email ne sera utilisé que pour vous recontacter à propos du
          diagnostic cyber.
        </p>
      </div>
    </div>
    <div class="actions">
      <Bouton boutonSoumission titre="Envoyer" type="primaire" />
      <a href="/" class="bouton secondaire">Revenir à la page d’accueil</a>
    </div>
  </form>
</dialog>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  dialog {
    min-width: 100%;
    height: 90vh;
    margin: auto 0 0;
    padding: 0;
    border: none;

    &::backdrop {
      background-color: rgba(0, 0, 0, 0.4);
    }

    @include a-partir-de(md) {
      height: min-content;
      max-width: 588px;
      min-width: 0;
      margin: auto;
      padding: 0 16px 16px 16px;
      border-radius: 8px;
    }
  }

  .dialogue {
    display: grid;
    grid-template-rows: 1fr auto;
    height: 100%;
  }

  .contenu {
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 16px;
  }

  h4 {
    font-size: 1.375rem;
    font-weight: bold;
    line-height: 1.75rem;
    margin: 0 0 16px;
  }

  h5 {
    font-style: normal;
    font-weight: bold;
    margin: 0;
  }

  .propositions {
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;

    label {
      display: flex;
      gap: 8px;
      align-items: flex-start;

      input {
        margin-top: 8px;
      }
    }
  }

  .contact {
    display: flex;
    flex-direction: column;
    gap: 8px;

    p {
      margin: 0;
      font-size: 0.75rem;
      line-height: 1.25rem;
      color: #666666;
    }
  }

  .actions {
    position: sticky;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;

    a {
      width: auto;
    }

    @include a-partir-de(md) {
      flex-direction: row-reverse;
    }
  }
</style>
