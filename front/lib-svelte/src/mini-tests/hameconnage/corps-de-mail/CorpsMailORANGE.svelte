<script lang="ts">
  const lienFactice = 'http://orange-mobile-service.com/annuler-rio';
</script>

<div class="corps-mail">
  <div class="entete">
    <img src="/assets/images/mini-tests/hameconnage/logo/orange.avif" alt="Logo Orange" />
    <p>Le service clients Orange</p>
  </div>
  <div class="texte-mail">
    <p>
      Bonjour,<br /><br />
      Une demande de transfert de votre numéro vers un autre opérateur a été enregistrée. Si vous n'êtes pas à l'origine de
      cette demande, confirmez immédiatement votre identité pour l'annuler, sous peine de perdre votre ligne sous 24h.
    </p>
    <a href={lienFactice} onclick={(e) => e.preventDefault()}>Annuler la portabilité</a>
  </div>
</div>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;

  .corps-mail {
    color: black;
    margin: 0.5rem -1rem -1rem -1rem;

    .entete {
      align-items: center;
      background-color: black;
      display: flex;
      gap: 2rem;
      padding: 1.5rem;

      img {
        height: 4.1875rem;
        width: 4.1875rem;
      }

      p {
        color: white;
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5rem;
        margin: 0;
      }
    }

    .texte-mail {
      align-items: flex-start;
      background-color: #f9f9f9;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem 1rem 2rem;

      @include a-partir-de(md) {
        padding: 1.5rem 7.5rem 5rem;
      }

      p {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem;
        margin: 0;
      }

      a {
        background-color: #ff7900;
        background-image: none;
        color: #f5f5fe;
        font-family: Marianne, sans-serif;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5rem;
        padding: 0.5rem 1rem;
        text-decoration: none;
      }
    }
  }
</style>
