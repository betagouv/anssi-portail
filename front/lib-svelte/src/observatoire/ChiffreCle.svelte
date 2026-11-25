<script lang="ts">
  import CarteDonnees from '../graphiques/CarteDonnees.svelte';
  import { formateDate } from './formatage';

  interface Props {
    id: string;
    titre: string;
    valeur: string;
    description?: string;
    infobulle: string;
    source: string;
    date: Date | null;
  }

  let { id, titre, valeur, description, infobulle, source, date }: Props = $props();
</script>

<CarteDonnees {id} {titre} {description} {infobulle} {source} date={date ? formateDate(date) : undefined}>
  <p class="chiffre-cle">{valeur}</p>
</CarteDonnees>

<style lang="scss">
  .chiffre-cle {
    color: var(--text-title-grey);
    font-size: 2.5rem;
    line-height: 3rem;
    font-weight: bold;
    text-align: center;
    padding: 1rem 0;
    margin: 0;
  }
</style>
