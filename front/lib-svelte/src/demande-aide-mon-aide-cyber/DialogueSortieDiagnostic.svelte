<script lang="ts">
  import axios from 'axios';
  import Bouton from '../ui/Bouton.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import Formulaire from '../ui/Formulaire.svelte';
  import Lien from '../ui/Lien.svelte';
  import Modale from '../ui/Modale.svelte';
  import ZoneTexte from '../ui/ZoneTexte.svelte';

  let etape: 'formulaire' | 'merci' = $state('formulaire');
  let afficheDialogue = $state(false);
  const titreDialogue = $derived(
    etape === 'formulaire'
      ? 'Aidez-nous à améliorer votre expérience️ 🙏\u00a0!'
      : 'Merci pour votre retour\u00a0🤩\u00a0! Vos remarques sont précieuses pour faire évoluer le service.'
  );

  export const affiche = () => {
    afficheDialogue = true;
  };
  type RaisonDisponible = 'pas-clair' | 'pas-le-temps' | 'pas-decisionnaire' | 'autre';
  let raison: RaisonDisponible | undefined = $state();
  let erreurRaison = $state(false);
  let precisionPasClair = $state('');
  let precisionAutre = $state('');
  let emailDeContact = $state('');

  const recupereLaBonnePrecision = (raison?: RaisonDisponible) => {
    switch (raison) {
      case 'pas-clair':
        return precisionPasClair;
      case 'autre':
        return precisionAutre;
      case 'pas-decisionnaire':
      case 'pas-le-temps':
      case undefined:
        return '';
    }
  };

  const soumetsLeFormulaire = async () => {
    if (!raison) {
      erreurRaison = true;
      return;
    }

    const precision = recupereLaBonnePrecision(raison);
    try {
      await axios.post('/api/retours-experience', {
        raison,
        precision,
        emailDeContact,
      });
      etape = 'merci';
    } catch (erreur) {
      console.log(erreur);
    }
  };

  $effect(() => {
    if (raison) erreurRaison = false;
  });
</script>

<Modale bind:estOuverte={afficheDialogue} titre={titreDialogue}>
  {#if etape === 'formulaire'}
    <Formulaire id="formulaire-sortie-diagnostic" surFormulaireValide={soumetsLeFormulaire}>
      <div class="contenu">
        <h5>🤔 Pourquoi n’avez-vous pas finalisé votre demande&nbsp;?</h5>
        {#if erreurRaison}
          <lab-anssi-alerte type="erreur" description="Veuillez sélectionner une réponse." fermable={false}
          ></lab-anssi-alerte>
        {/if}
        <div class="propositions">
          <label>
            <input type="radio" value="pas-clair" bind:group={raison} />
            <span>Ce n’est pas assez clair / J’aimerais en savoir plus</span>
          </label>
          {#if raison === 'pas-clair'}
            <ZoneTexte aideSaisie="Précisez votre réponse (facultatif)" bind:valeur={precisionPasClair} />
          {/if}
          <label>
            <input type="radio" value="pas-le-temps" bind:group={raison} />
            <span> Je n’ai pas le temps maintenant </span>
          </label>
          <label>
            <input type="radio" value="pas-decisionnaire" bind:group={raison} />
            <span>Je ne suis pas décisionnaire</span>
          </label>
          <label>
            <input type="radio" value="autre" bind:group={raison} />
            <span>Autre</span>
          </label>
          {#if raison === 'autre'}
            <ZoneTexte aideSaisie="Précisez votre réponse (facultatif)" bind:valeur={precisionAutre} />
          {/if}
        </div>
        <div class="contact">
          <h5>📧 Une question ? Nos équipes se tiennent à votre disposition.</h5>
          <ChampTexte
            aideSaisie="Ex : jean.dupont@mail.com"
            id="email-contact"
            libelle="Email de contact"
            messageErreur="L'email est invalide"
            nom="email"
            type="email"
            bind:valeur={emailDeContact}
          />
          <p class="texte-mention-xs">
            Votre email ne sera utilisé que pour vous recontacter à propos du diagnostic cyber.
          </p>
        </div>
      </div>
    </Formulaire>
  {:else}
    <div class="contenu">
      <p>
        Vous avez demandé à être recontacté(e) ? Notre équipe prendra contact avec vous prochainement à l’adresse
        fournie.
      </p>
    </div>
  {/if}
  {#snippet actions()}
    {#if etape === 'formulaire'}
      <Bouton
        etire
        libelle="Envoyer"
        type="primaire"
        taille="md"
        boutonSoumission={true}
        idFormulaire="formulaire-sortie-diagnostic"
      />
      <Lien etire href="/" apparence="bouton" type="secondaire" libelle="Revenir à la page d’accueil"></Lien>
    {:else}
      <Lien etire href="/" apparence="bouton" libelle="Revenir à la page d’accueil"></Lien>
    {/if}
  {/snippet}
</Modale>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .contenu {
    display: flex;
    flex-direction: column;
    gap: 16px;

    p {
      color: #3a3a3a;
      margin: 0;

      @include a-partir-de(lg) {
        margin-bottom: 24px;
      }
    }
  }

  h5 {
    font-size: 1rem;
    font-style: normal;
    font-weight: bold;
    margin: 0;
  }

  .propositions {
    padding: 0 0 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;

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
    }
  }
</style>
