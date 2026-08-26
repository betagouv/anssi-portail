<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import Lien from '../ui/Lien.svelte';
  import MotEnExergue from '../ui/MotEnExergue.svelte';
  import CarrouselMaturite from './animation/CarrouselMaturite.svelte';

  interface Props {
    introFaite?: boolean;
  }

  let { introFaite = $bindable(false) }: Props = $props();
  let enPause = $state(false);
  const libelléPause = $derived(enPause ? 'Lancer les animations' : 'Mettre les animations en pause');

  const basculePause = () => {
    enPause = !enPause;
  };

  function debuteTeste() {
    introFaite = true;
  }

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Test de maturité cyber', fondSombre: false };
</script>

<HerosRiche
  description="Obtenez en 6 questions une évaluation indicative de la maturité cyber de votre organisation."
  {propriétésFilAriane}
  variante="cafe-creme"
  badges={[
    { label: '⏱️ 5 min.', accent: 'purple-glycine' },
    { label: '🔥 +12k organisations ont fait le test', accent: 'purple-glycine' },
  ]}
  class="avec-image-fond"
>
  {#snippet titreHtml()}
    Quelle est la <MotEnExergue motif="vague" couleur="macaron">maturité</MotEnExergue>
    <MotEnExergue motif="vague" couleur="macaron" petit>cyber</MotEnExergue> de votre organisation ?
  {/snippet}
  {#snippet illustration()}
    <div class="illustration-du-bandeau">
      <CarrouselMaturite {enPause} />
      <div class="controle-animation">
        <Bouton
          type="secondaire"
          icone={enPause ? 'play-circle-line' : 'pause-circle-line'}
          iconeSeule
          libelle={libelléPause}
          titre={libelléPause}
          surClic={basculePause}
        />
      </div>
    </div>
  {/snippet}
  {#snippet actions()}
    <div class="conteneur-actions">
      <Bouton libelle="Débuter le test" type="primaire" surClic={debuteTeste} />
      <Lien href="/session-groupe" icone="team-fill" libelle="Accéder à l’espace session en groupe" />
    </div>
  {/snippet}
  {#snippet mentionAdditionnelle()}
    Le résultat obtenu est une évaluation indicative basée sur un modèle élaboré par l’ANSSI.<br />
    La maturité cyber n’est pas une évaluation du niveau de sécurité des systèmes d’information d’une organisation mais de
    sa posture à l’égard des enjeux cyber.
  {/snippet}
</HerosRiche>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .illustration-du-bandeau {
    width: 100%;
  }

  .controle-animation {
    text-align: right;

    @media (prefers-reduced-motion: reduce) {
      display: none;
    }
  }

  .conteneur-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    @include a-partir-de(lg) {
      gap: 32px;
    }
  }
</style>
