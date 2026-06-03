<script lang="ts">
  import Lien from '../ui/Lien.svelte';
  import type { Mesure } from './mesure';

  interface Props {
    mesure: Mesure;
  }

  const { mesure }: Props = $props();
</script>

<dsfr-card
  title={mesure.phraseAccroche}
  description={mesure.titre}
  enlarge={false}
  no-link={true}
  has-description="true"
  has-buttons={true}
  src={`/assets/images/parcours-securisation/mesure-${mesure.id}.svg`}
>
  <div slot="buttonsgroup" class="actions-carte">
    <Lien apparence="bouton" href={`/mesures/${mesure.id}`} type="primaire" libelle="Prendre en compte" etire={true}
    ></Lien>
  </div>
</dsfr-card>

<style lang="scss">
  .actions-carte {
    display: flex;
    flex-direction: column;
  }
</style>
