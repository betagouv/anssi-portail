<script lang="ts">
  import type { Component } from 'svelte';
  import Lien from '../ui/Lien.svelte';
  import type { Mesure } from './mesure';

  interface Props {
    mesure: Mesure;
  }

  const { mesure }: Props = $props();
  const typeDeLien = $derived(mesure.estPriseEnCompte ? 'secondaire' : 'primaire');
  const libelleDeLien = $derived(mesure.estPriseEnCompte ? 'Accéder au détail' : "Passer à l'action");
  const titre = $derived(mesure.phraseAccroche || mesure.titre);
  const description = $derived(mesure.phraseAccroche ? mesure.titre : undefined);
  let survol = $state(false);

  const vignettesAnimées = import.meta.glob<{ default: Component<{ survol: boolean }> } | undefined>(
    './animation/mesures/Mesure*.svelte'
  );

  const vignetteAnimée = $derived.by(async () => {
    return (await vignettesAnimées[`./animation/mesures/Mesure${mesure.id.replaceAll('.', '')}.svelte`]?.())?.default;
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<dsfr-card
  {description}
  enlarge={false}
  has-buttons={true}
  has-description="true"
  has-header-badge={mesure.estPriseEnCompte || undefined}
  no-link={true}
  src={`/assets/images/parcours-securisation/mesure-${mesure.id}.avif`}
  title={titre}
  size="sm"
  onmouseenter={() => (survol = true)}
  onmouseleave={() => (survol = false)}
>
  <div slot="headerbadges">
    <dsfr-badge
      accent="green-emeraude"
      has-icon
      icon="checkbox-circle-fill"
      label="Prise en compte"
      size="sm"
      type="accent"
    ></dsfr-badge>
  </div>
  <div slot="buttonsgroup" class="actions-carte">
    <Lien apparence="bouton" href={`/mesures/${mesure.id}`} type={typeDeLien} libelle={libelleDeLien} etire={true}
    ></Lien>
  </div>

  {#await vignetteAnimée}
    Chargement…
  {:then VignetteAnimée}
    {#if VignetteAnimée}
      <div slot="image" class="image">
        <VignetteAnimée {survol} />
      </div>
    {/if}
  {/await}
</dsfr-card>

<style lang="scss">
  .actions-carte {
    display: flex;
    flex-direction: column;
  }
  .image {
    display: flex;
    flex-direction: column;
  }
</style>
