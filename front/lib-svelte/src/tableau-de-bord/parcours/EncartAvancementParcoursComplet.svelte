<script lang="ts">
  import { DsfrBadge } from '@lab-anssi/ui-kit';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import CarteMesure from '../../parcours-securisation/CarteMesure.svelte';
  import type { Mesure, Module } from '../../parcours-securisation/mesures/mesure';
  import Progression from '../../parcours-securisation/Progression.svelte';
  import Lien from '../../ui/Lien.svelte';
  import { détecteMédia, requêteMédiaÀPartirDeSm } from '../../utils/rendu.svelte';
  import AnneauProgressionTexte from './AnneauProgressionTexte.svelte';
  import ProgressionParcoursComplet from './ProgressionParcoursComplet.svelte';

  type ModulePrésentation = {
    id: number;
    nom: string;
    description: string;
    mesures: Mesure[];
  };

  const àPartirDeSm = détecteMédia(requêteMédiaÀPartirDeSm);
  let modules: ModulePrésentation[] = $state([]);
  let prochaineMesureÀFaire: Mesure | undefined = $state();
  let nombreMesuresPrisesEnCompte: number = $state(0);
  let nombreMesures = $state(0);
  let parcoursTerminé = $state(false);

  onMount(async () => {
    const { data } = await axios.get<{ modules: Module[] }>('/api/parcours/complet');
    modules = data.modules;
    const mesures = data.modules.flatMap((m) => m.mesures);
    prochaineMesureÀFaire = mesures.find((mesure) => !mesure.estPriseEnCompte);
    nombreMesuresPrisesEnCompte = mesures.filter((mesure) => mesure.estPriseEnCompte).length;
    nombreMesures = mesures.length;
    parcoursTerminé = nombreMesuresPrisesEnCompte === nombreMesures;
  });

  const pageSource = 'espace-connecté-encart-avancement-parcours-complet';
  const libelléActionRecommandée = $derived(
    nombreMesuresPrisesEnCompte === 0 ? 'première action recommandée' : 'action recommandée'
  );
</script>

<div class="avancement">
  <h2 class="titre">Parcours de sécurisation</h2>
  <div class="progression">
    <div class="resume">
      <h3 class="fr-h6">Nombre de mesures prises en compte</h3>
      <div class="anneau">
        <AnneauProgressionTexte
          actuel={nombreMesuresPrisesEnCompte}
          max={nombreMesures}
          libelle="Nombre de mesures prises en compte"
        />
      </div>
    </div>
    <div class="avancement-par-module">
      <p class="texte-mention-xs">PROGRESSION PAR MODULE</p>
      {#each modules as module (module.id)}
        {@const mesuresPriseEnCompteParModule = module.mesures.filter((m) => m.estPriseEnCompte).length}
        <div class="detail-module">
          <p class="texte-detail-sm">{module.nom}</p>
          <div class="progression-visuelle">
            <Progression mode="sans-titre" actuel={mesuresPriseEnCompteParModule} max={module.mesures.length} />
            <p class="texte-standard-md">{mesuresPriseEnCompteParModule}/{module.mesures.length}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="encouragements">
    <ProgressionParcoursComplet {nombreMesures} {nombreMesuresPrisesEnCompte} />
  </div>
  <div class="carte">
    {#if prochaineMesureÀFaire}
      <CarteMesure mesure={prochaineMesureÀFaire} horizontal={àPartirDeSm.correspond}>
        {#snippet badges()}
          <div slot="badgesgroup">
            <DsfrBadge accent="yellow-moutarde" label={libelléActionRecommandée} type="accent" size="sm" />
          </div>
        {/snippet}
      </CarteMesure>
    {:else if parcoursTerminé}
      <div class="parcours-termine">
        <p class="texte-standard-md">
          <b>Ce parcours est terminé mais votre sécurisation continue&nbsp;:</b>
        </p>
        <ul>
          <li>Revoir régulièrement les mesures&#8239;;</li>
          <li>Vérifier certaines mesures critiques&#8239;;</li>
          <li>Refaire un point dans 6 ou 12 mois&#8239;;</li>
          <li>
            Suivre les <Lien
              blank
              href="https://cyber.gouv.fr/nous-connaitre/publications/"
              libelle="dernières recommandations de l’ANSSI."
              neutre
            />
          </li>
        </ul>
        <img loading="lazy" src="/assets/images/parcours-securisation/homme-gravissant-des-marches.avif" alt="" />
      </div>
    {/if}
  </div>
  <div class="lien">
    <Lien
      libelle="Accédez aux modules"
      icone="arrow-right-line"
      iconeADroite
      href={`/parcours-complet?pageSource=${pageSource}`}
    />
  </div>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .avancement {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
    background-color: var(--background-default-grey);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);

    @include a-partir-de(lg) {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-areas:
        'titre progression'
        'encouragements progression'
        'carte progression'
        'lien progression';
    }

    .titre {
      grid-area: titre;
      margin: 0;
    }

    .progression {
      grid-area: progression;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .resume {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        border-radius: 0.5rem;
        background-color: var(--background-alt-green-bourgeon);

        @include a-partir-de(md) {
          align-items: center;
          flex-direction: row;
          gap: 1.5rem;

          h3 {
            margin: 0;
          }
        }

        .anneau {
          margin-inline: auto;
        }
      }

      .avancement-par-module {
        display: none;

        @include a-partir-de(lg) {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          .texte-mention-xs {
            margin-bottom: 0.5rem;
          }
        }

        .detail-module {
          display: inline-grid;
          row-gap: 8px;
          column-gap: 8px;
          align-self: stretch;
          grid-template-rows: repeat(1, fit-content(100%));
          grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
          grid-auto-flow: row;

          .texte-detail-sm {
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .progression-visuelle {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            grid-row: span 1;
            grid-column: span 1;
            justify-self: stretch;
            min-width: 90px;

            p {
              min-width: 40px;
              margin-bottom: 0;
              text-align: end;
            }
          }
        }
      }
    }

    .encouragements {
      grid-area: encouragements;
    }

    .carte {
      grid-area: carte;

      .parcours-termine {
        display: grid;
        grid-template-areas:
          'titre'
          'details'
          'illustration';
        grid-template-columns: 1fr;
        gap: 1rem;

        padding: 1rem;
        background-color: var(--background-alt-blue-france);

        @include a-partir-de(md) {
          grid-template-columns: 2fr 1fr;
          grid-template-areas:
            'titre illustration'
            'details illustration';
        }

        p {
          grid-area: titre;
        }

        ul {
          grid-area: details;
        }

        img {
          grid-row: illustration;
          width: 100%;
          max-width: 240px;
          align-self: center;
          justify-self: center;
        }
      }

      :global(dsfr-card) {
        min-height: auto;
      }
    }

    .lien {
      grid-area: lien;
    }
  }
</style>
