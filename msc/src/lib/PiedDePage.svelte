<script lang="ts">
  import { DsfrFooter } from '@lab-anssi/ui-kit';
  import Lien from '$msc/ui/Lien.svelte';

  const liens = [
    {
      label: 'À propos',
      href: '/a-propos',
    },
    {
      label: 'Mentions légales',
      href: '/mentions-legales',
    },
    {
      label: 'Politique de confidentialité',
      href: '/confidentialite',
    },
    {
      label: 'Conditions générales',
      href: '/cgu',
    },
    {
      label: 'Statistiques d’utilisation',
      href: '/statistiques',
    },
    {
      label: 'Sécurité',
      href: '/securite',
    },
    {
      label: 'Accessibilité : non conforme',
      href: '/accessibilite',
    },
    {
      label: 'Protéger ma collectivité',
      href: '/collectivites',
    },
    {
      label: 'Protéger mon entreprise',
      href: '/entreprises',
    },
    {
      label: 'Protéger mon association',
      href: '/associations',
    },
    {
      label: 'Parcours de sécurisation cyberdépart',
      href: '/parcours-cyberdepart',
    },
    {
      label: 'Parcours de sécurisation complet',
      href: '/parcours-securisation-complet',
    },
    {
      label: 'Conseils cyber',
      href: '/conseils-cyber',
    },
    {
      label: 'Kit relais',
      href: '/kit-relais',
    },
  ].map((lien) => ({ ...lien, markup: 'a' }));
</script>

<DsfrFooter
  id="pied"
  brandLinkHref="/"
  brandLinkTitle="Retour à l'accueil du site - MesServicesCyber - République Française"
  partnerTitle=""
  hasDescription
  contentDescription="slot"
  bottomLinks={liens}
>
  <svelte:fragment slot="description">
    <p>
      MesServicesCyber est la plateforme pour faciliter l'accès de tous aux services et ressources de l'ANSSI et de ses
      partenaires.
    </p>
    <p>
      Il est développé par l'<Lien
        href="https://cyber.gouv.fr/"
        taille="sm"
        blank
        libelle="Agence nationale de la sécurité des systèmes d'information"
        neutre
      ></Lien>, en lien avec
      <Lien href="https://beta.gouv.fr/" taille="sm" blank libelle="BetaGouv" neutre></Lien>
      et la
      <Lien
        href="https://www.numerique.gouv.fr/dinum/"
        taille="sm"
        blank
        libelle="Direction interministérielle du numérique"
        neutre
      ></Lien>.
    </p>
  </svelte:fragment>
</DsfrFooter>

<style>
  :global(#pied) {
    color: var(--text-default-grey);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  p {
    font-size: 0.875rem;
    line-height: 1.5rem;
    margin: 0;
  }

  p + p {
    margin-top: 1rem;
  }

  :global(#pied .fr-footer__bottom-link),
  :global(#pied .fr-footer__content-link) {
    display: inline;
    width: auto;
  }

  :global(#pied .fr-footer__content-link::after) {
    background-image: none;
  }
</style>
