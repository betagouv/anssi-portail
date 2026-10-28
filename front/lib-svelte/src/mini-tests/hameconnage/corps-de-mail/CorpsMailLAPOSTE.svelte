<script lang="ts">
  const lienSuivi = 'https://www.laposte.fr/outils/suivre-vos-envois';
  const dossierImages = '/assets/images/mini-tests/hameconnage/logo';
  const quinzeJours = 15;
  const aujourdhui = new Date();
  const dateDeLivraison = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate() + quinzeJours);
  const libelléDateDeLivraison = Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(dateDeLivraison);
</script>

<div class="corps-mail">
  <div class="texte-mail">
    <div class="entete">
      <img class="logo" src="{dossierImages}/colissimo.avif" alt="Logo Colissimo" />
      <span class="statut">En transit</span>
    </div>

    <div class="suivi">
      <p class="numero">N° du colis 5M23778449079</p>
      <div class="progression">
        <img src="{dossierImages}/colissimo-suivi.avif" alt="Étapes du colis : préparé, transit, livraison, livré" />
      </div>
      <p class="etat">Votre colis est en transit</p>
    </div>

    <div class="livraison">
      <div class="date">
        <img src="{dossierImages}/colissimo-calendrier.avif" alt="" />
        <div class="texte-date">
          <p>Il sera livré</p>
          <p class="jour">{libelléDateDeLivraison}</p>
        </div>
      </div>
      <a href={lienSuivi} onclick={(e) => e.preventDefault()}>Suivre mon colis</a>
    </div>

    <div class="depot">
      <img src="{dossierImages}/colissimo-boite-aux-lettres.avif" alt="" />
      <p>Votre colis sera déposé dans votre boîte aux lettres</p>
    </div>

    <div class="wallet">
      <p class="titre">Ne perdez plus votre colis de vue</p>
      <p>
        Le wallet Colissimo vous permet de suivre votre colis, d’être alerté à chaque étape et de présenter facilement
        vos infos lors du retrait.
      </p>
    </div>

    <div class="slogan">
      <p>Colissimo, le choix d'une livraison plus responsable et réussie</p>
    </div>

    <div class="mentions">
      <p>
        La Poste-Colissimo est responsable du traitement de vos données à caractère personnel transmises par
        l’expéditeur. Vous recevez ce mail car nous collectons vos données dans le cadre du transport, de la
        distribution et du suivi de votre colis Colissimo.
      </p>
      <p>
        Pour en savoir plus sur vos droits et la protection de vos données, consultez notre politique de protection des
        données à caractère personnel.
      </p>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;

  .corps-mail {
    --fond-mail: #f9f9f9;
    border-top: 1px solid var(--border-default-grey);
    color: black;
    margin: 0.5rem -1rem -1rem -1rem;

    p {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 0.875rem;
      font-style: normal;
      line-height: 1.5rem;
      margin: 0;
    }

    .texte-mail {
      --marge-interne: 1rem;
      background-color: var(--fond-mail);
      padding: 0 0.5rem 2rem;

      @include a-partir-de(md) {
        --marge-interne: 3.375rem;
        padding: 0 7.5rem 7.5rem;
      }
    }

    .entete {
      align-items: center;
      background-color: white;
      border-bottom: 3px solid #ddd;
      display: flex;
      justify-content: space-between;
      padding: 1rem var(--marge-interne);

      .logo {
        aspect-ratio: 450 / 230;
        width: 6.6875rem;
      }

      .statut {
        align-items: center;
        background-color: #ddd;
        border-radius: 9999px;
        color: #0d0c21;
        display: flex;
        font-family: Marianne, sans-serif;
        font-size: 0.875rem;
        gap: 0.5rem;
        line-height: 1.5rem;
        padding: 0.25rem 0.75rem;

        &::before {
          background-color: #0d0c21;
          border-radius: 50%;
          content: '';
          height: 0.4375rem;
          width: 0.4375rem;
        }
      }
    }

    .suivi {
      background-color: white;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem var(--marge-interne);
      text-align: center;

      .progression {
        align-self: center;
        aspect-ratio: 6 / 1;
        max-width: 28.125rem;
        overflow: hidden;
        position: relative;
        width: 100%;

        img {
          height: 107.14%;
          left: 0;
          position: absolute;
          top: -6.9%;
          width: 100%;
        }
      }

      .etat {
        font-size: 1.125rem;
      }
    }

    .livraison {
      align-items: center;
      background-color: #fcf7e5;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: space-between;
      padding: 1.5rem var(--marge-interne);

      .date {
        align-items: center;
        display: flex;
        gap: 0.5rem;

        img {
          height: 3rem;
          width: 3rem;
        }
      }

      .jour {
        font-size: 1.125rem;
        font-weight: 900;
      }

      a {
        background-color: #0d0c21;
        background-image: none;
        border-radius: 6.25rem;
        color: #f5f5fe;
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.75rem;
        padding: 0.625rem 1.5rem;
        text-decoration: none;
        white-space: nowrap;
      }
    }

    .depot {
      align-items: center;
      background-color: #ecf3b0;
      display: flex;
      gap: 0.5rem;
      padding: 1rem var(--marge-interne);

      img {
        height: 2rem;
        width: 2rem;
      }
    }

    .wallet {
      background-color: white;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem var(--marge-interne);

      @include a-partir-de(md) {
        padding-inline: 5rem;
      }

      .titre {
        font-size: 1.3125rem;
        font-weight: 700;
      }
    }

    .slogan {
      background-color: #e37302;
      padding: 2.5rem var(--marge-interne);
      text-align: center;

      p {
        font-size: 1.1875rem;
      }
    }

    .mentions {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 0.625rem 0 2.5rem;

      p {
        font-size: 0.75rem;
        line-height: 1.0625rem;
      }
    }
  }
</style>
