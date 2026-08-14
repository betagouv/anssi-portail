<script lang="ts">
  import { afficheNouvelleDA } from '$plateforme/environnement';
  import Alternatives from '../../ui/Alternatives.svelte';
  import { fabriqueFilAriane } from '../../ui/filAriane';
  import FilAriane, { type Props as PropriétésFilAriane } from '../../ui/FilAriane.svelte';
  import Heros from '../../ui/Heros.svelte';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import Proteger from '../Proteger.svelte';

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Protéger mon association', fondSombre: true };
</script>

<Alternatives affichageAlternatif={afficheNouvelleDA}>
  {#snippet défaut()}
    <Heros
      cacheActions
      cacheIllustration={false}
      cacheTags
      description="Les associations sont aussi concernées par le risque de cyberattaques. Elles peuvent être la cible de campagnes de
        hameçonnage / phishing ou de rançongiciels / ransomwares. Il n'est pas trop tard pour agir et des solutions existent&nbsp;!"
      format="heros"
      illustrationAlt=""
      illustrationSource="/assets/images/personne-avec-micro-consultant-sites-cyber.svg"
      theme="sombre"
      titre="Protéger mon association contre les cyberattaques"
      segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
    >
      {#snippet preambule()}
        <h1 class="alternatif-xs">Protéger mon association contre les cyberattaques</h1>
        <p class="texte-chapo-xl">
          Les associations sont aussi concernées par le risque de cyberattaques. Elles peuvent être la cible de
          campagnes de hameçonnage / phishing ou de rançongiciels / ransomwares. Il n'est pas trop tard pour agir et des
          solutions existent&nbsp;!
        </p>
      {/snippet}
      {#snippet filAriane()}
        <FilAriane {...propriétésFilAriane} />
      {/snippet}
    </Heros>
  {/snippet}
  {#snippet alternatif()}
    <HerosRiche
      description="Les associations sont aussi concernées par le risque de cyberattaques. Elles peuvent être la cible de campagnes de
        hameçonnage / phishing ou de rançongiciels / ransomwares. Il n'est pas trop tard pour agir et des solutions existent&nbsp;!"
      propriétésFilAriane={{ ...propriétésFilAriane, fondSombre: false }}
      variante="vert-clair"
    >
      {#snippet titreHtml()}
        Protéger mon <span class="mot-souligne"><span>association</span></span> contre les cyberattaques
      {/snippet}
      {#snippet illustration()}
        <img src="/assets/images/personne-avec-micro-consultant-sites-cyber.svg" alt="" />
      {/snippet}
    </HerosRiche>
  {/snippet}
</Alternatives>

<Proteger origine="landing-associations" />

<style lang="scss">
  img {
    width: 100%;
  }

  .mot-souligne {
    position: relative;
    white-space: nowrap;

    span {
      position: relative;
      z-index: 2;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 31px;
      pointer-events: none;
      background: {
        image: url('/assets/images/motif-mot-souligne-vague-moutarde.svg');
        repeat: no-repeat;
        position: center;
        size: contain;
      }
    }
  }
</style>
