<script lang="ts">
  import { DsfrBadge } from '@lab-anssi/ui-kit';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import CarteMesure from '../../parcours-securisation/CarteMesure.svelte';
  import type { Mesure, Module } from '../../parcours-securisation/mesures/mesure';
  import Lien from '../../ui/Lien.svelte';
  import AnneauProgressionTexte from './AnneauProgressionTexte.svelte';

  type ModulePrésentation = {
    id: number;
    nom: string;
    description: string;
    cibleBadge?: number;
    nombreMesuresTotal: number;
    nombreMesuresPrisesEnCompte: number;
    mesures: Mesure[];
  };

  const àPartirDeSm = new MediaQuery('min-width: 576px');
  let _modules: ModulePrésentation[] = $state([]);
  let prochaineMesureÀFaire: Mesure | undefined = $state();
  let nombreMesuresPrisesEnCompte: number = $state(0);
  let nombreMesuresTotal = $state(0);
  let parcoursTerminé = $state(false);

  onMount(async () => {
    const { data } = await axios.get<{ modules: Module[] }>('/api/parcours/complet');
    _modules = data.modules;
    const mesures = data.modules.flatMap((m) => m.mesures);
    prochaineMesureÀFaire = mesures.find((mesure) => !mesure.estPriseEnCompte);
    nombreMesuresPrisesEnCompte = mesures.filter((mesure) => mesure.estPriseEnCompte).length;
    nombreMesuresTotal = mesures.length;
    parcoursTerminé = nombreMesuresPrisesEnCompte === nombreMesuresTotal;
  });

  const pageSource = 'espace-connecté-encart-avancement-parcours-complet';
  const libelléActionRecommandée = $derived(
    nombreMesuresPrisesEnCompte === 0 ? 'première action recommandée' : 'action recommandée'
  );
</script>

<div class="avancement">
  <h2 class="titre">Parcours de sécurisation</h2>
  <div class="progression">
    <h3 class="fr-h6">Nombre de mesures prises en compte</h3>
    <div class="anneau">
      <AnneauProgressionTexte
        actuel={nombreMesuresPrisesEnCompte}
        max={nombreMesuresTotal}
        libelle="Nombre de mesures prises en compte"
      />
    </div>
  </div>
  <div class="encouragements">
    <p class="texte-standard-md">
      👉 Votre parcours de sécurisation commence ici&#8239;! Mettez en place vos premières mesures pour renforcer dès
      maintenant la cybersécurité de votre organisation.
    </p>
  </div>
  <div class="carte">
    {#if prochaineMesureÀFaire}
      <CarteMesure mesure={prochaineMesureÀFaire} horizontal={àPartirDeSm.current}>
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
  <Lien
    libelle="Accédez aux modules"
    icone="arrow-right-line"
    iconeADroite
    href={`/parcours-complet?pageSource=${pageSource}`}
  />
</div>

<style lang="scss">
  .avancement {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
    background-color: var(--background-default-grey);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);

    .titre {
      margin: 0;
    }

    .progression {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      border-radius: 0.5rem;
      background-color: var(--background-alt-green-bourgeon);

      .anneau {
        margin-inline: auto;
      }
    }

    .encouragements {
      p {
        margin: 0;
      }
    }

    .parcours-termine {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      background-color: var(--background-alt-blue-france);
    }
  }
</style>
