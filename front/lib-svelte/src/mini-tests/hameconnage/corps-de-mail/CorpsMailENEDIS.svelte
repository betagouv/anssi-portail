<script lang="ts">
  const lienFactice = 'http://enedis-exploitation-pro.com/intervention';
</script>

<div class="corps-mail">
  <div class="logo">
    <img src="/assets/images/mini-tests/hameconnage/logo/enedis.avif" alt="Logo enedis" />
  </div>
  <div class="message">
    <p>
      Bonjour,<br /><br />
      Notre système de télérelève a détecté une anomalie critique sur le compteur électrique de votre site professionnel (risque
      de surtension). Une intervention technique doit être programmée sous 24h pour éviter une coupure d'urgence de votre
      alimentation.<br />
      Merci de confirmer un créneau d'intervention et de régler les frais de déplacement du technicien (39&nbsp;€) via le
      lien ci-dessous.
    </p>
    <a href={lienFactice} onclick={(e) => e.preventDefault()}>
      <span class="texte-article-lg">Confirmer mon créneau et régler les frais (39&nbsp;€)</span>
    </a>
    <p class="signature">L’équipe exploitation ENEDIS</p>
  </div>
</div>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;
  .corps-mail {
    color: black;
    width: 100%;
    padding-top: 0.5rem;

    .logo {
      border-block: 1px solid var(--border-default-grey);
      padding: 1.5rem;

      img {
        width: 10rem;
      }
    }

    .message {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-top: 1.5rem;
      padding-inline: 0.5rem;
      p {
        font-family: Roboto;
        margin: 0;
      }

      .signature {
        font-style: italic;
        font-weight: 300;
      }

      a {
        display: flex;
        padding: 1.5rem;
        gap: 0.5rem;
        background-color: #1423dc;
        background-image: none;
        text-decoration: none;
        @include a-partir-de(sm) {
          padding: 0.62rem 1.5rem;
        }
        span {
          display: block;
          overflow: hidden;
          color: #f5f5fe;
          text-overflow: ellipsis;
          font-family: Marianne;
          font-size: 1.125rem;
          font-style: normal;
          font-weight: 500;
          line-height: 1.75rem;
          text-align: left;
          margin: 0;
        }
      }
    }
  }
</style>
