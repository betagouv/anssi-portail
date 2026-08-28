<script lang="ts">
  import { type PropriétésFilAriane } from '../../ui/filAriane';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import MotEnExergue from '../../ui/MotEnExergue.svelte';
  import IllustrationHerosEntreprises from '../animation/IllustrationHerosEntreprises.svelte';
  import Proteger from '../Proteger.svelte';

  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Protéger mon entreprise contre les cyberattaques',
    fondSombre: true,
  };
</script>

<HerosRiche
  description="Toutes les entreprises sont exposées au risque de cyberattaques. En 2025, les TPE/PME et ETI ont notamment
      représenté 48&nbsp;% des victimes de rançongiciels ou ransowmare représentant les premières entités visées."
  propriétésFilAriane={{ ...propriétésFilAriane, fondSombre: false }}
  variante="vert-clair"
>
  {#snippet titreHtml()}
    Protéger mon <MotEnExergue motif="vague">entre&shy;prise</MotEnExergue> contre les cyber&shy;attaques
  {/snippet}
  {#snippet illustration()}
    <IllustrationHerosEntreprises />
  {/snippet}
</HerosRiche>

<Proteger origine="landing-entreprises" />
