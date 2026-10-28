<script lang="ts">
  const dossierImages = '/assets/images/mini-tests/hameconnage/logo';
</script>

<div class="corps-mail">
  <div class="courrier">
    <img class="logo" src="{dossierImages}/amendes-gouv.avif" alt="Logo amendes.gouv.fr" />
    <p class="titre">Service de paiement en ligne des amendes</p>
    <div class="message">
      <p>
        Madame, Monsieur,<br /><br />
        Vous trouverez ci-joint votre avis de contravention n°AM-664821 (135&nbsp;€) relatif à l'infraction constatée à votre
        encontre.<br /><br />
        Merci de bien vouloir l'imprimer, le signer et nous le retourner par retour d'email sous 5 jours accompagné de votre
        règlement, faute de quoi une majoration sera appliquée et le dossier transmis pour recouvrement.
      </p>
    </div>
    <hr />
    <p class="intitule-piece-jointe">Pièce jointe</p>
    <div class="piece-jointe">
      <img src="{dossierImages}/contravention.avif" alt="" />
      <button type="button" onclick={(e) => e.preventDefault()}>
        <span>Avis_contravention_AM-664821.doc</span>
        <lab-anssi-icone nom="download-line" taille="xs"></lab-anssi-icone>
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;

  .corps-mail {
    background-color: white;
    border-top: 1px solid var(--border-default-grey);
    color: black;
    margin: 0.5rem -1rem -1rem -1rem;
    padding: 1.5rem 0.5rem 2rem;

    @include a-partir-de(md) {
      padding: 1.5rem 7.5rem 7.5rem;
    }

    .courrier {
      background-color: white;
      border: 1px solid black;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;

      @include a-partir-de(md) {
        padding: 5rem;
      }
    }

    p {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 0.875rem;
      font-style: normal;
      line-height: 1.5rem;
      margin: 0;
    }

    .logo {
      aspect-ratio: 259 / 58;
      max-width: 16.1875rem;
      width: 100%;
    }

    .titre {
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
    }

    .message {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    hr {
      background-color: #d9d9d9;
      border: none;
      height: 1px;
      margin: 0;
      padding: 0;
      width: 100%;
    }

    .intitule-piece-jointe {
      font-weight: 600;
    }

    .piece-jointe {
      align-items: center;
      align-self: flex-start;
      background-color: #f6f6f6;
      border-radius: 0.375rem;
      display: flex;
      gap: 0.5rem;
      max-width: 100%;
      padding: 0.25rem 0.5rem 0.25rem 1rem;

      img {
        height: 1.5rem;
        width: 1.5rem;
      }

      button {
        align-items: center;
        background: none;
        border: none;
        color: #274370;
        cursor: pointer;
        display: flex;
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.875rem;
        gap: 0.5rem;
        line-height: 1.5rem;
        padding: 0;
        text-align: left;

        span {
          overflow-wrap: anywhere;
          text-decoration: underline;
        }

        lab-anssi-icone {
          padding-left: 1rem;
        }
      }
    }
  }
</style>
