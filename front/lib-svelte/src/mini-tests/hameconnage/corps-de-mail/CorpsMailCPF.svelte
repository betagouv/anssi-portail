<div class="corps-mail">
  <div class="carte">
    <img
      class="logo"
      src="/assets/images/mini-tests/hameconnage/logo/compte-formation.avif"
      alt="Logo Mon Compte Formation"
    />

    <p>
      Bonjour, <br /><br />
      Vos droits à la formation (CPF) non utilisés vont être perdus à la fin du mois. Scannez le QR code ci-dessous pour les
      sécuriser et choisir votre formation.
    </p>

    <img class="qr-code" src="/assets/images/mini-tests/hameconnage/logo/qr-code-compte-formation.avif" alt="QR code" />
  </div>
</div>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;

  .corps-mail {
    background-color: white;
    border-top: 1px solid var(--border-default-grey);
    color: black;
    margin: 0.5rem -1rem -1rem -1rem;
    padding: 0.5rem 0.5rem 1rem;

    @include a-partir-de(md) {
      padding: 1.5rem;
    }

    .carte {
      align-items: flex-start;
      background-color: #f9f9f9;
      border-radius: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.5rem;

      @include a-partir-de(md) {
        padding: 2.5rem 3.125rem;
      }
    }

    .logo {
      align-self: center;
      aspect-ratio: 2 / 1;
      width: 8.875rem;
    }

    p {
      font-family: Roboto, sans-serif;
      font-size: 1.125rem;
      font-style: normal;
      font-weight: 400;
      line-height: 1.5rem;
      margin: 0;
    }

    .qr-code {
      padding-top: 1rem;
      height: 7.375rem;
      object-fit: cover;
      width: 7.25rem;
    }
  }
</style>
