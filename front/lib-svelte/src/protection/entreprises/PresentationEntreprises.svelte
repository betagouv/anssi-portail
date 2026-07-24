<script lang="ts">
  import { fabriqueFilAriane } from '../../ui/filAriane';
  import FilAriane, { type Props as PropriétésFilAriane } from '../../ui/FilAriane.svelte';
  import Heros from '../../ui/Heros.svelte';
  import Proteger from '../Proteger.svelte';

  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Protéger mon entreprise contre les cyberattaques',
    fondSombre: true,
  };
</script>

<Heros
  cacheActions
  cacheIllustration={false}
  cacheTags
  description="Toutes les entreprises sont exposées au risque de cyberattaques. En 2025, les TPE/PME et ETI ont notamment
      représenté 48&nbsp;% des victimes de rançongiciels ou ransowmare représentant les premières entités visées."
  format="heros"
  illustrationAlt=""
  illustrationSource="/assets/images/personne-avec-laptop-entoure-de-diagrammes.svg"
  theme="sombre"
  titre="Protéger mon entreprise contre les cyberattaques"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
>
  {#snippet preambule()}
    <h1 class="alternatif-xs">Protéger mon entreprise contre les cyberattaques</h1>
    <p class="texte-chapo-xl">
      Toutes les entreprises sont exposées au risque de cyberattaques. En 2025, les TPE/PME et ETI ont notamment
      représenté 48&nbsp;% des victimes de rançongiciels ou ransowmare représentant les premières entités visées.
    </p>
  {/snippet}
  {#snippet filAriane()}
    <FilAriane {...propriétésFilAriane} />
  {/snippet}
</Heros>

<Proteger origine="landing-entreprises" />
