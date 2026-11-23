<script lang="ts">
  import { DsfrBadge } from '@lab-anssi/ui-kit';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import AnneauProgression from '../../parcours-securisation/AnneauProgression.svelte';
  import CarteMesure from '../../parcours-securisation/CarteMesure.svelte';
  import type { Mesure } from '../../parcours-securisation/mesures/mesure';
  import BadgeCyberdepart from '../../parcours-securisation/module-cyberdepart/BadgeCyberdepart.svelte';
  import BoutonPartageBadgeCyberdepart from '../../parcours-securisation/module-cyberdepart/BoutonPartageBadgeCyberdepart.svelte';
  import BoutonTelechargementVisuels from '../../parcours-securisation/module-cyberdepart/BoutonTelechargementVisuels.svelte';
  import type { ModuleRéponseApi } from '../../parcours-securisation/moduleReponseApi';
  import Progression from '../../parcours-securisation/Progression.svelte';
  import Lien from '../../ui/Lien.svelte';

  const àPartirDeSm = new MediaQuery('min-width: 576px');

  let prochaineMesureÀFaire: Mesure | undefined = $state();
  let moduleCyberdépart: ModuleRéponseApi | undefined = $state();
  let moduleTerminé = $state(false);
  onMount(async () => {
    const { data } = await axios.get<ModuleRéponseApi>(`/api/modules/1`);
    moduleCyberdépart = data;
    prochaineMesureÀFaire = data.mesures.find((mesure) => !mesure.estPriseEnCompte);
    moduleTerminé = data.mesures.every((mesure) => mesure.estPriseEnCompte);
  });

  const totalMesures = $derived(moduleCyberdépart?.mesures.length ?? 0);
  const cibleBadge = $derived(moduleCyberdépart?.cibleBadge ?? 0);
  const nombreMesuresPrisesEnCompte = $derived(
    moduleCyberdépart?.mesures.filter((mesure) => mesure.estPriseEnCompte).length ?? 0
  );
  const cibleAtteinte = $derived(nombreMesuresPrisesEnCompte >= cibleBadge);

  const pageSource = 'espace-connecté-encart-avancement-cyberdépart';
  const nomLogo = $derived(cibleAtteinte ? 'logo-cyberdepart.svg' : 'logo-cyberdepart-transparent.svg');
</script>

<div class="avancement-cyberdepart">
  <div class="corps">
    <div class="entete-et-carte">
      <div class="entete">
        <h2 class="titre">Cyberdépart</h2>
        <div class="progression">
          <Progression actuel={nombreMesuresPrisesEnCompte} max={totalMesures} cible={cibleBadge} mode="sans-titre"
          ></Progression>
        </div>
        <p class="texte-standard-md">
          <strong>🛡️Renforcez dès maintenant votre sécurité.</strong> Commencez par des actions simples et concrètes pour
          protéger votre organisation contre les cyberattaques.
        </p>
      </div>
      {#if prochaineMesureÀFaire}
        <CarteMesure mesure={prochaineMesureÀFaire} horizontal={àPartirDeSm.current}>
          {#snippet badges()}
            <div slot="badgesgroup">
              <DsfrBadge accent="yellow-moutarde" label="première action recommandée" type="accent" size="sm" />
            </div>
          {/snippet}
        </CarteMesure>
      {/if}
    </div>
    {#if !moduleTerminé}
      <div class="objectif">
        <div class="anneau">
          <AnneauProgression actuel={nombreMesuresPrisesEnCompte} max={cibleBadge} />
        </div>
        <img loading="lazy" src={`/assets/images/parcours-securisation/${nomLogo}`} alt="logo cyberdépart" />
        {#if cibleAtteinte}
          <BoutonPartageBadgeCyberdepart taille="sm" typeDuBouton="secondaire" />
          <BoutonTelechargementVisuels taille="sm" />
        {:else}
          <p class="texte-standard-md">{cibleBadge} mesures à prendre en compte pour valider votre Cyberdépart.</p>
        {/if}
      </div>
    {/if}
  </div>
  <div class="footer">
    {#if moduleTerminé}
      <BadgeCyberdepart />
    {/if}
    <Lien
      libelle={`Accédez aux ${totalMesures} mesures`}
      icone="arrow-right-line"
      iconeADroite
      href={`/modules/1?pageSource=${pageSource}`}
    />
  </div>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .avancement-cyberdepart {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background-color: var(--background-default-grey);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
    gap: 1.5rem;

    .corps {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @include a-partir-de(md) {
        flex-direction: row;
      }

      .entete-et-carte {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        @include a-partir-de(md) {
          flex-shrink: 1000;
        }

        .entete {
          display: grid;
          grid-template-areas:
            'titre'
            'progression'
            'introduction';
          gap: 1.5rem;
          align-items: center;

          @include a-partir-de(sm) {
            grid-template-areas:
              'titre progression'
              'introduction introduction';
            grid-template-columns: 1fr 1fr;
          }

          .titre {
            grid-area: titre;
            margin: 0;
          }
          .progression {
            grid-area: progression;
            @include a-partir-de(sm) {
              margin-left: auto;
            }
          }
          p {
            grid-area: introduction;
          }
        }

        :global(dsfr-card) {
          min-height: auto;
        }
      }

      .objectif {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 0.5rem;
        background-color: var(--blue-france-925-125);
        padding: 1rem 1.5rem 1.5rem 1.5rem;
        gap: 1rem;

        @include a-partir-de(md) {
          flex-shrink: 1;
          min-width: 0;
          max-width: 235px;
        }

        .anneau {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        img {
          max-width: 100%;
          height: auto;
          align-self: center;
        }

        p {
          color: var(--text-action-high-blue-france);
          text-align: center;
          margin: 0;
        }
      }
    }

    .footer {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-self: start;
    }
  }
</style>
