<script lang="ts">
  import Lien from '../ui/Lien.svelte';
</script>

<dsfr-container class="conteneur-heros">
  <div class="surtitre fr-h4">Je protège mon activité</div>
  <h1 class="alternatif-md">Agissez pour votre cybersécurité&nbsp;!</h1>
  <div class="action">
    <Lien
      apparence="bouton"
      href="#"
      libelle="Protéger mon organisation"
      iconeADroite
      icone="arrow-right-circle-fill"
      type="primaire-inverse"
      taille="lg"
      etire
    />
  </div>
  <div class="illustration">
    <img src="/assets/images/mario-dsi-et-femme-qui-utilisent-mss.png" alt="Mario, le DSI et une femme utilisent MSS" />
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;
  .conteneur-heros {
    background-color: var(--background-flat-blue-france);
    padding-block: 6rem;

    .surtitre {
      text-transform: uppercase;
      color: var(--yellow-moutarde-925-125);
      margin-bottom: 0.75rem;
    }
    h1 {
      margin-bottom: 3rem;
      color: var(--text-inverted-grey);
      word-break: break-word;
    }
    .action {
      display: flex;
      flex-direction: column;
      margin-bottom: 3rem;
      @include a-partir-de(md) {
        flex-direction: row;
      }
    }

    .illustration {
      display: flex;
      flex-direction: column;

      img {
        width: 100%;
        max-width: taille-pour-colonnes(8);
        margin-inline: auto;
      }
    }
  }
</style>
