<script lang="ts">
  import { type PropriétésFilAriane } from '../../ui/filAriane';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import MotEnExergue from '../../ui/MotEnExergue.svelte';
  import IllustrationHerosAssociations from '../animation/IllustrationHerosAssociations.svelte';
  import Proteger from '../Proteger.svelte';

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Protéger mon association', fondSombre: true };
</script>

<HerosRiche
  description="Les associations sont aussi concernées par le risque de cyberattaques. Elles peuvent être la cible de campagnes de
        hameçonnage / phishing ou de rançongiciels / ransomwares. Il n'est pas trop tard pour agir et des solutions existent&nbsp;!"
  propriétésFilAriane={{ ...propriétésFilAriane, fondSombre: false }}
  variante="vert-clair"
>
  {#snippet titreHtml()}
    Protéger mon <MotEnExergue motif="vague">association</MotEnExergue> contre les cyberattaques
  {/snippet}
  {#snippet illustration()}
    <IllustrationHerosAssociations />
  {/snippet}
</HerosRiche>

<Proteger origine="landing-associations" />
