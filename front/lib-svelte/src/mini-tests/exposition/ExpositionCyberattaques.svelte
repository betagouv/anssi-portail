<script lang="ts">
  import type { PropriétésFilAriane } from '../../ui/filAriane';
  import FilAriane from '../../ui/FilAriane.svelte';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import EvaluationExposition from './EvaluationExposition.svelte';
  import { type MenaceEvaluee, menacesPertinentes, type ReponsesExposition } from './expositionCyberattaques';
  import FormulaireExposition from './FormulaireExposition.svelte';
  import RadarExpositionAnime from './RadarExpositionAnime.svelte';

  const propriétésFilAriane: PropriétésFilAriane = {
    branche: { nom: 'Faire le test !', lien: '/faire-le-test/' },
    feuille: 'Mon organisation est-elle exposée aux cyberattaques ?',
  };

  let étape: 'formulaire' | 'résultats' = $state('formulaire');
  let menaces: MenaceEvaluee[] = $state([]);

  const évalue = (reponses: ReponsesExposition) => {
    menaces = menacesPertinentes(reponses);
    étape = 'résultats';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

{#if étape === 'formulaire'}
  <HerosRiche
    {propriétésFilAriane}
    variante="cafe-creme"
    class="avec-image-fond"
    badges={[{ label: '⏱️ 2 minutes', accent: 'green-bourgeon' }]}
    description="Rançongiciel, fraude au virement, espionnage, déstabilisation, cyberharcèlement : chaque attaque poursuit un but différent. En 2 minutes, situez celles qui pèsent le plus sur votre organisation."
  >
    {#snippet titreHtml()}
      Quels types de cyber&shy;attaques peuvent cibler mon organisation ?
    {/snippet}
    {#snippet illustration()}
      <div class="radar">
        <RadarExpositionAnime />
      </div>
    {/snippet}
  </HerosRiche>

  <FormulaireExposition onévaluer={évalue} />
{:else}
  <dsfr-container>
    <FilAriane {...propriétésFilAriane} />
  </dsfr-container>
  <EvaluationExposition {menaces} />
{/if}

<style lang="scss">
  .radar {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
