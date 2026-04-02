<script lang="ts">
  import FilAriane from '../ui/FilAriane.svelte';
</script>

<dsfr-container>
  <FilAriane feuille="Newsletter MesServicesCyber" />

  <div class="formulaire">
    <hgroup>
      <h2>
        <lab-anssi-icone nom="mail-line" taille="lg"
        ></lab-anssi-icone>Abonnement à la newsletter
      </h2>
    </hgroup>
    <dsfr-alert type="success" size="sm" title="Merci&nbsp;!">
      <p slot="description">
        Votre inscription à la newsletter MesServicesCyber a bien été prise en
        compte.
      </p>
    </dsfr-alert>
    <img
      src="/assets/images/dragon-coeur-entier.svg"
      alt="Le dragon vous remercie"
    />
    <dsfr-button
      markup="a"
      label="Accéder à la page d’accueil"
      kind="secondary"
      href="/"
    ></dsfr-button>
  </div>
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
    margin-top: 1.5rem;
    padding: 3.5rem 1rem;
    gap: 2rem;

    img {
      max-width: 340px;
      align-self: center;
    }

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
      margin-left: auto;
      margin-right: auto;
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
