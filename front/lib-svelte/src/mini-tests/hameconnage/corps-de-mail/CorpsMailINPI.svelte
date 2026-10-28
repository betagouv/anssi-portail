<script lang="ts">
  const lienJustificatif = 'https://formalites.entreprises.gouv.fr';
  const lienDonneesPersonnelles = 'https://www.inpi.fr/fr/donnees-personnelles';
</script>

<div class="corps-mail">
  <div class="carte">
    <div class="message">
      <p>Bonjour,</p>
      <p>
        Votre formalité (dossier n°FE-2026-084213) a été validée et transmise avec succès aux organismes destinataires
        (greffe du tribunal de commerce, Urssaf, Insee, services fiscaux...). Aucune anomalie n'a été détectée sur ce
        dossier.
      </p>
      <p>
        Vous pouvez consulter le justificatif de dépôt dans votre espace déclarant sur
        <a href={lienJustificatif} onclick={(e) => e.preventDefault()}>formalites.entreprises.gouv.fr.</a>
      </p>
      <p>L'Institut National de la Propriété Industrielle</p>
      <p>Votre chargé d’information INPI Direct</p>
    </div>
    <p class="donnees-personnelles">
      Consultez <a href={lienDonneesPersonnelles} onclick={(e) => e.preventDefault()}>notre page dédiée</a> à la protection
      des données personnelles.
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
    padding: 0.5rem 0.5rem 2rem;

    @include a-partir-de(md) {
      padding: 1.5rem 5rem 2.8125rem;
    }

    .carte {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .message {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
      color: #000091;
      display: inline;
      text-decoration: underline;
      width: auto;
    }

    .donnees-personnelles {
      font-size: 0.5625rem;
      font-weight: 700;
      line-height: 0.8125rem;
      text-align: center;

      a {
        color: black;
      }
    }
  }
</style>
