<script lang="ts">
  import { onMount } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import Accordeon from './Accordeon.svelte';
  import Marelle from './Marelle.svelte';
  import DemandeDiagnosticSimplifiee from '../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';

  let estBureau = false;
  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });
</script>

<Heros
  format="heros"
  theme="sombre"
  cacheTags={true}
  titre="Directive NIS 2"
  description="Préparez-vous et renforcez dès à présent le niveau de cybersécurité de votre organisation."
  cacheActions={false}
  illustrationSource="/assets/images/nis2.svg"
  illustrationAlt="NIS2"
  cacheIllustration={!estBureau}
>
  {#snippet filAriane()}
    <FilAriane fondSombre={true} feuille="Directive NIS 2" />
  {/snippet}
  {#snippet actions()}
    <dsfr-button
      label="Pré-enregistrer mon entité"
      markup="a"
      href="https://club.ssi.gouv.fr/#/nis2/introduction"
      target="_blank"
      has-icon
      icon-place="right"
      icon="external-link-line"
      centered
    ></dsfr-button>
  {/snippet}
</Heros>

<dsfr-container>
  <div class="introduction">
    <h2>Qu’est-ce que NIS&nbsp;2&nbsp;?</h2>
    <p>
      Entrée en vigueur en octobre 2024, la directive NIS&nbsp;2 (sécurité des
      réseaux et des systèmes d'Information) vise à renforcer le niveau de
      cybersécurité des tissus économique et administratif des pays membres de
      l'UE.
    </p>
    <p>
      La transposition de la directive NIS&nbsp;2 en France est en cours. En
      attendant la publication de l’ensemble des textes de transposition, et
      compte tenu de la menace actuelle, les futures entités essentielles et
      importantes sont invitées à s’engager dès à présent dans une démarche
      visant à renforcer leur niveau de sécurité.
    </p>

    <Accordeon />
  </div>
</dsfr-container>

<dsfr-container class="marelle">
  <Marelle />
</dsfr-container>

<dsfr-container class="diagnostic">
  <DemandeDiagnosticSimplifiee origine="directive-nis2" />
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .introduction {
    justify-self: center;
    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
    }
  }

  .marelle {
    background-color: #f6f6f6;
  }

  .diagnostic {
    padding: 4.5rem 0;
  }
</style>
