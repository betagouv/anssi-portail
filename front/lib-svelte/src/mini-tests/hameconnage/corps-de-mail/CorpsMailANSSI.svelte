<script lang="ts">
  const lienFactice = 'http://anssi-gouv-fr.net/correctifs/patch-urgent.zip';
</script>

<div class="corps-mail">
  <div class="entete">
    <img class="logo-anssi" src="/assets/images/mini-tests/hameconnage/logo/anssi.avif" alt="Logo ANSSI" />
    <img
      class="logo-republique"
      src="/assets/images/mini-tests/hameconnage/logo/republique-francaise.avif"
      alt="Logo République française"
    />
  </div>
  <div class="texte-mail">
    <div class="carte">
      <img class="logo-cert" src="/assets/images/mini-tests/hameconnage/logo/cert-fr.avif" alt="Logo CERT-FR" />
      <p class="titre">ALERTES DE SÉCURITÉ</p>
      <div class="separateur"></div>
      <div class="message">
        <p>Bonjour,</p>
        <p>
          Dans le cadre de notre mission de surveillance de la menace cyber, l'ANSSI a détecté une vulnérabilité
          critique activement exploitée (réf. <span class="reference">ANSSI-CERT-2026-0847</span>) susceptible
          d'affecter votre infrastructure. Nous vous recommandons d'appliquer en urgence le correctif de sécurité
          ci-dessous, sous peine d'exposition à une cyberattaque imminente.
        </p>
        <a href={lienFactice} onclick={(e) => e.preventDefault()}>Télécharger le correctif officiel</a>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;

  .corps-mail {
    --fond-mail: #f9f9f9;
    --rouge-alerte: #d20808;
    color: black;
    margin: 0.5rem -1rem -1rem -1rem;

    img {
      object-fit: cover;
    }

    .entete {
      align-items: flex-start;
      background-color: var(--fond-mail);
      border-top: 1px solid var(--border-default-grey);
      display: flex;
      justify-content: space-between;
      padding: 1rem 1.5rem;

      @include a-partir-de(md) {
        padding: 1rem 7.5rem;
      }

      .logo-anssi {
        height: 4.4375rem;
        width: 4.6875rem;
      }

      .logo-republique {
        height: 2.875rem;
        width: 7.9375rem;
      }
    }

    .texte-mail {
      background-color: var(--fond-mail);
      border-bottom: 1px solid var(--border-default-grey);
      padding: 0.5rem 0.5rem 2rem;

      @include a-partir-de(md) {
        padding: 1.5rem 7.5rem 7.5rem;
      }
    }

    .carte {
      background-color: white;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;

      @include a-partir-de(md) {
        padding: 5rem;
      }

      p,
      a {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.875rem;
        font-style: normal;
        line-height: 1.5rem;
        margin: 0;
      }

      .logo-cert {
        height: 2.875rem;
        width: 3.774375rem;
      }

      .titre {
        color: var(--rouge-alerte);
        font-size: 1.5rem;
        font-weight: 700;
      }

      .separateur {
        background-color: var(--rouge-alerte);
        height: 3px;
        width: 4.125rem;
      }

      .message {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .reference {
          color: var(--rouge-alerte);
          font-weight: 600;
        }

        a {
          color: #000091;
          font-weight: 700;
          text-decoration: underline;
        }
      }
    }
  }
</style>
