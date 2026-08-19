<script lang="ts">
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
</script>

<dsfr-card
  {description}
  enlarge={false}
  has-buttons={true}
  has-description="true"
  has-header-badge={mesure.estPriseEnCompte || undefined}
  no-link={true}
  src={`/assets/images/parcours-securisation/mesure-${mesure.id}.svg`}
  title={titre}
  size="sm"
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
</dsfr-card>

<style lang="scss">
  .actions-carte {
    display: flex;
    flex-direction: column;
  }
</style>
