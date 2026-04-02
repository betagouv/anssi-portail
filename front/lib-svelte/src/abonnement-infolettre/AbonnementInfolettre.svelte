<script lang="ts">
  import FilAriane from '../ui/FilAriane.svelte';
</script>

<dsfr-container>
  <FilAriane feuille="Newsletter MesServicesCyber" />

  <form>
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
      required
    ></dsfr-input>

    <dsfr-checkbox
      id="acceptation-infolettre"
      name="acceptation-infolettre"
      errorMessage="Cette information est obligatoire."
      hint="La politique de confidentialité est disponible ici."
      required
    >
      <span>J'accepte de recevoir la newsletter de MesServicesCyber.</span>
    </dsfr-checkbox>

    <dsfr-button label="S'abonner à la newsletter" kind="primary"></dsfr-button>
  </form>
</dsfr-container>

<style lang="scss">
  dsfr-button {
    align-self: center;
  }

  dsfr-container {
    padding: 1rem 0 3rem;
  }

  form {
    background-color: var(--background-alt-blue-france);
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-top: 1.5rem;
    padding: 3.5rem 1rem;

    .texte-standard-md {
      margin-bottom: 0;
    }
  }

  h2 {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
</style>
