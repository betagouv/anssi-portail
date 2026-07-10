<script lang="ts">
  import { onMount } from 'svelte';
  import Heros from '../ui/Heros.svelte';
  import Lien from '../ui/Lien.svelte';
  import axios from 'axios';
  import type { Module } from './mesure';
  import Progression from './Progression.svelte';

  let modules: {
    titre: string;
    description: string;
    libelleLien: string;
    cibleBadge?: number;
    nombreMesuresTotal: number;
  }[] = $state([]);

  onMount(async () => {
    const réponse = await axios.get<{ modules: Module[] }>('/api/parcours/complet');
    modules = réponse.data.modules.map((module) => ({
      ...module,
      titre: module.nom,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus nibh, faucibus sed elit quis, aliquet malesuada augue.',
      libelleLien: module.id === 1 ? 'Prendre mon Cyberdépart' : 'Accéder aux mesures',
    }));
  });
</script>

<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus nibh, faucibus sed elit quis, aliquet malesuada augue."
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre="Parcours de sécurisation"
  theme="sombre"
></Heros>
<dsfr-container>
  <div class="grille">
    {#each modules as module, index (module.titre)}
      <div class="carte" class:mise-en-avant={index === 0}>
        <p class="texte-standard-md">Notre sélection pour vous lancer</p>
        <dsfr-card
          description={module.description}
          enlarge={false}
          has-buttons={true}
          has-description="true"
          no-link={true}
          src="/assets/images/image-generique.avif"
          title={module.titre}
          has-detail-end={true}
        >
          <div class="progression" slot="contentend">
            <Progression
              actuel={0}
              max={module.nombreMesuresTotal}
              cible={module.cibleBadge}
              mode="compact"
              libelle="Mesures prises en compte"
            />
          </div>

          <div slot="buttonsgroup" class="actions-carte">
            <Lien apparence="bouton" href="#" type="primaire" libelle={module.libelleLien} etire={true} />
          </div>
        </dsfr-card>
      </div>
    {/each}
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .actions-carte {
    display: flex;
    flex-direction: column;
  }

  .grille {
    display: grid;
    --colonnes: 1;
    grid-template-columns: repeat(var(--colonnes), 1fr);
    gap: 1rem;
    padding-bottom: 1rem;
    @include a-partir-de(md) {
      gap: 1.5rem;
      --colonnes: 2;
      padding-bottom: 3rem;
    }
    @include a-partir-de(lg) {
      --colonnes: 3;
      padding-bottom: 4.5rem;
    }
  }

  .progression {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex: 1;
  }

  .carte {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    dsfr-card {
      flex: 1;
    }
    p {
      display: none;
    }
    &:nth-child(2) {
      @include a-partir-de(md) {
        padding-top: 3rem;
      }
    }
    &:nth-child(3) {
      @include a-partir-de(lg) {
        padding-top: 3rem;
      }
    }
    &.mise-en-avant {
      position: relative;
      padding-top: 0.75rem;
      margin-bottom: 1rem;
      p {
        display: block;
        text-align: center;
        margin-bottom: 0;
        font-weight: bold;
        z-index: 1;
      }

      @include a-partir-de(md) {
        margin-bottom: 0;
      }
      &:before {
        content: '';
        background-color: var(--background-contrast-blue-france);
        position: absolute;
        top: 0rem;
        bottom: -1rem;
        right: -1rem;
        left: -1rem;
        @include a-partir-de(md) {
          bottom: -0.75rem;
          right: -0.75rem;
          left: -0.75rem;
        }
      }
    }
  }
</style>
