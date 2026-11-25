<script lang="ts">
  import { DsfrHeader, DsfrSkipLink } from '@lab-anssi/ui-kit';
  import BadgeAgentAnssi from '$msc/badge-agent-anssi/BadgeAgentAnssi.svelte';
  import ZoneIdentification from '$msc/identification/ZoneIdentification.svelte';
  import Navigation from '$msc/navigation/Navigation.svelte';

  let { chemin }: { chemin: string } = $props();
</script>

<DsfrSkipLink
  items={[
    { label: 'Contenu', href: '#contenu' },
    { label: 'Pied de page', href: '#pied' },
  ]}
/>
<DsfrHeader
  id="haut-de-page"
  brandLogoTitle="République<br>Française"
  brandLinkHref="/"
  brandLinkTitle="Retour à l'accueil du site MesServicesCyber - République Française"
  hasBrandOperator
  brandOperatorSrc="/assets/images/logo-anssi.svg"
  brandOperatorAlt="MesServicesCyber"
  brandService="MesServicesCyber"
  hasBrandTagline
  brandTagline="Innovation ANSSI"
  hasToolLinks
  menuId="menu-burger-mobile"
  hasNavigation
  navigationId="menu-principal"
>
  <span slot="headerbadge"><BadgeAgentAnssi /></span>
  <div slot="toolLinks"><ZoneIdentification /></div>
  <div slot="modalToolLinks"><ZoneIdentification /></div>
  <div slot="beforetoolslinks">
    <lab-anssi-bouton-suite-cyber-navigation sourceutm="MesServicesCyber"></lab-anssi-bouton-suite-cyber-navigation>
  </div>
  <div slot="beforenavbarbuttons">
    <lab-anssi-bouton-suite-cyber-navigation sourceutm="MesServicesCyber"></lab-anssi-bouton-suite-cyber-navigation>
  </div>
  <div slot="navigation" id="navigation"><Navigation cheminRelatif={chemin} /></div>
</DsfrHeader>

<style>
  :global(#haut-de-page .fr-header__operator img) {
    height: 4rem;
  }
</style>
