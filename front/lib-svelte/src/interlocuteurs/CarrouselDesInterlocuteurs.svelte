<script lang="ts"></script>

<h2>
  Trouvez les interlocuteurs et dispositifs<br />pour vous soutenir dans vos
  efforts.
</h2>
<lab-anssi-carrousel-tuiles>
  <dsfr-tile
    title="Contacts cyber"
    has-description="true"
    description="Des contacts cyber de proximité pour vous orienter et répondre à vos questions."
    href="/contacts"
    enlarge="true"
  >
    <img
      slot="pictogram"
      src="/assets/images/trois-mains-croisees.svg"
      alt="Contacts cyber"
    />
  </dsfr-tile>
  <dsfr-tile
    title="Prestataires labellisés"
    has-description="true"
    description="Tous les prestataires de confiance et produits/services labellisés afin de vous accompagner sur vos différents enjeux cyber&nbsp;: audits, homologations, réponses à incidents..."
    href="/prestataires-labellises"
    enlarge="true"
  >
    <img
      slot="pictogram"
      src="/assets/images/coche-jaune-sur-rond-noir.svg"
      alt="Prestataires labellisés"
    />
  </dsfr-tile>
  <dsfr-tile
    title="Financements cyber"
    has-description="true"
    description="Bénéficiez d’aides et de subventions pour renforcer la maturité cyber de votre organisation."
    href="/financements"
    enlarge="true"
  >
    <img
      slot="pictogram"
      src="/assets/images/pile-de-pieces.svg"
      alt="Financements cyber"
    />
  </dsfr-tile>
</lab-anssi-carrousel-tuiles>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  h2 {
    text-align: center;
    margin-bottom: 48px;
  }

  lab-anssi-carrousel-tuiles {
    margin-top: 24px;
    min-width: 794px;

    dsfr-tile {
      flex: 1 0 254px;
      scroll-snap-align: center;
      @include a-partir-de(lg) {
        flex: 1 0 241px;
      }
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
</style>
