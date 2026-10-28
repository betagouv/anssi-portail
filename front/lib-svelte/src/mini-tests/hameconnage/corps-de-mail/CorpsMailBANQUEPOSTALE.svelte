<div class="corps-mail">
  <div class="contenu">
    <img
      class="logo"
      src="/assets/images/mini-tests/hameconnage/logo/banque-postale.avif"
      alt="Logo La Banque Postale"
    />
    <div class="message">
      <p class="titre">Votre Relevé de compte en ligne</p>
      <p>Bonjour,</p>
      <p>Nous vous informons que le relevé du 21.09.2026 de votre Compte Bancaire est disponible en ligne.</p>
      <p>
        Pour le consulter, vous pouvez vous connecter sur le site de La Banque Postale et vous rendre dans “Documents
        &amp; Souscriptions / Relevés et document” ou sur l’application mobile de la Banque Postale dans le menu ‘Menu
        Plus / Gestion / Relevés.”
      </p>
      <p>
        Cordialement,<br />
        Votre Service La Banque Postale
      </p>
    </div>
    <p class="mention">
      Ce message est généré automatiquement, ne répondez pas à l’expéditeur.<br />
      Si vous n’êtes pas destinataire(s) de ce message, merci de le détruire.
    </p>
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
      padding: 1.5rem 5rem 7.5rem;
    }

    .contenu {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    p {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.5rem;
      margin: 0;
    }

    .logo {
      aspect-ratio: 80 / 69;
      object-fit: cover;
      width: 5rem;
    }

    .message {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .titre {
      font-weight: 700;
    }

    .mention {
      font-size: 0.5625rem;
      font-weight: 700;
      line-height: 0.8125rem;
      text-align: center;
    }
  }
</style>
