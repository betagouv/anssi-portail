<script lang="ts">
  import axios from 'axios';
  import { untrack } from 'svelte';
  import Bouton from '../ui/Bouton.svelte';
  import type { Mesure } from './mesure';

  type Props = {
    mesure: Mesure;
  };

  const { mesure }: Props = $props();
  let priseEnCompteEnCours = $state(false);
  let mesurePriseEnCompte = $state(untrack(() => mesure.estPriseEnCompte));
  const prendEnCompte = async () => {
    try {
      priseEnCompteEnCours = true;
      const reponse = await axios.put(`/api/mesures/${mesure.id}/prise-en-compte`);
      sessionStorage.setItem('mesure-prise-en-compte', 'true');
      if (reponse.data.badgeCyberdépartDebloqué) {
        sessionStorage.setItem('badge-cyberdepart-debloque', 'true');
      }
      if (reponse.data.parcoursCompletTerminé) {
        sessionStorage.setItem('parcours-complet-termine', 'true');
      }
      if (reponse.data.moduleTerminé) {
        sessionStorage.setItem('module-termine', 'true');
      }
      const requete = new URLSearchParams(window.location.search);
      const nouvelleUrl =
        requete.has('source') && requete.get('source') === 'liste'
          ? '/parcours-complet#mesures'
          : `/modules/${mesure.idModule}`;
      window.location.href = nouvelleUrl;
      mesurePriseEnCompte = true;
    } finally {
      priseEnCompteEnCours = false;
    }
  };
</script>

{#if mesurePriseEnCompte}
  <div class="conteneur-pris-en-compte">
    <lab-anssi-icone nom="checkbox-circle-fill" taille="lg"></lab-anssi-icone>
    <p class="texte-article-lg">Mesure prise en compte</p>
  </div>
{:else}
  <div class="conteneur-non-pris-en-compte">
    <dsfr-tooltip
      class="aide"
      content="Une recommandation prise en compte signifie que vous avez compris son intérêt, vous avez identifié si elle est pertinente pour votre organisation et si c'est le cas, vous allez désormais faire en sorte de l'appliquer."
      id="tooltip"
      type="hover"
    >
      <dsfr-button label="infobulle" preset="tooltip"></dsfr-button>
    </dsfr-tooltip>
    <p class="texte-article-lg">Cette mesure est-elle prise en compte ?</p>
    <div class="action">
      <Bouton
        desactive={priseEnCompteEnCours}
        etire={true}
        libelle="Prendre en compte"
        surClic={prendEnCompte}
        type="primaire"
      />
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  :global(dsfr-footer) {
    margin-bottom: 192px;
    @include a-partir-de(md) {
      margin-bottom: 0;
    }
  }

  .conteneur-non-pris-en-compte {
    display: flex;
    flex-direction: column;

    position: fixed;
    box-sizing: border-box;
    bottom: 0;
    left: 0;
    width: 100vw;
    background: var(--yellow-moutarde-925-125);
    z-index: 10;
    padding: 8px 8px 32px;

    @include a-partir-de(md) {
      position: sticky;
      width: auto;
      top: 0;
      margin-left: 16px;
    }
    .aide {
      align-self: flex-end;
    }
    .texte-article-lg {
      font-weight: bold;
      color: var(--text-title-grey);
      margin-inline: 16px;
    }
    .action {
      display: flex;
      flex-direction: column;
      margin-inline: 16px;
    }
  }

  .conteneur-pris-en-compte {
    align-items: center;
    background-color: var(--background-contrast-success);
    color: var(--text-title-grey);
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
    padding: 1.5rem;

    @include a-partir-de(md) {
      flex-direction: column;
      margin-left: 16px;

      .texte-article-lg {
        text-align: center;
      }
    }

    p {
      margin-bottom: 0;
      font-weight: bold;
    }
    lab-anssi-icone {
      color: var(--text-default-success);
    }
  }
</style>
