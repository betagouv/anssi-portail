<script lang="ts">
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.type';
  import Lien from '../ui/Lien.svelte';
  import EncartDeRecommandationSelonMaturite from './EncartDeRecommandationSelonMaturite.svelte';
  import PartageTest from './PartageTest.svelte';
  import TuilesMaturite from './TuilesMaturite.svelte';

  export let animeTuiles = true;
  export let dateRealisation: Date | undefined = undefined;
  export let defilementAutomatique = true;
  export let idNiveau: IdNiveau;

  const trouveNiveauMaturiteParId = (id: string) =>
    niveauxMaturite.find((niveau) => niveau.id === id) || niveauxMaturite[0];

  $: niveau = trouveNiveauMaturiteParId(idNiveau);

  $: dateFormatee = dateRealisation
    ? new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
      }).format(new Date(dateRealisation))
    : undefined;
</script>

<dsfr-container class="resultats-test">
  <div class="contenu-section">
    {#if dateFormatee}
      <div class="date-realisation">Test réalisé le {dateFormatee}</div>
    {/if}
    <h2>Niveau de maturité le plus proche : {niveau.label}</h2>
    <TuilesMaturite niveauCourant={niveau} {animeTuiles} {defilementAutomatique} />
    <div class="description-niveau">
      <h5>{niveau.label}</h5>
      <p>{niveau.description} <Lien href="/niveaux-maturite" blank libelle="En savoir plus sur les niveaux"></Lien></p>
    </div>
  </div>
</dsfr-container>

<EncartDeRecommandationSelonMaturite {niveau} />

<PartageTest />

<style lang="scss">
  .date-realisation {
    color: #3a3a3a;
    margin-bottom: 4px;
  }
</style>
