<script lang="ts">
  import Lien from '../../../ui/Lien.svelte';

  const lienFactice = 'https://proconnect.gouv.fr/signalement';
</script>

<div class="corps-mail">
  <div class="logo">
    <img src="/assets/images/mini-tests/hameconnage/logo/proconnect.avif" alt="Logo ProConnect" />
  </div>
  <div class="texte-mail">
    <div class="carte">
      <p>
        Bonjour Camille Dupont,<br /><br />
        Une connexion avec ProConnect a eu lieu le <strong>15 septembre 2026</strong> à 09:14 (heure de Paris) sur le
        site
        <strong>Chorus Pro</strong> avec votre compte professionnel MonComptePro.<br /><br />
        Vous recevez cette alerte car une connexion inhabituelle avec ProConnect a été détectée. Si vous êtes à l'origine
        de cette connexion, aucune action n'est requise. Dans le cas contraire, contactez notre équipe support pour sécuriser
        votre accès.
      </p>
      <Lien
        apparence="bouton"
        href={lienFactice}
        libelle="«&nbsp;Je signale une usurpation&nbsp;»"
        surClic={(e) => e.preventDefault()}
        taille="sm"
      />
      <p>
        Pour suivre et contrôler votre utilisation de ProConnect, vous pouvez également consulter votre historique de
        connexion via votre tableau de bord.
      </p>
      <p>L'équipe ProConnect</p>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;

  .corps-mail {
    --fond-mail: #f9f9f9;
    color: black;
    padding-top: 0.5rem;
    margin: 0rem -1rem -1rem -1rem;

    .logo {
      background-color: var(--fond-mail);
      border-top: 1px solid var(--border-default-grey);
      display: flex;
      justify-content: center;
      padding: 1.5rem;

      img {
        width: 11.8125rem;
        height: 4.25rem;
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

      padding: 1.5rem;

      @include a-partir-de(md) {
        padding: 5rem;
      }

      p {
        color: black;
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.5rem;
      }
    }
  }
</style>
