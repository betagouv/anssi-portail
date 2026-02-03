<script lang="ts">
  import Accordeon from './Accordeon.svelte';
  import Marelle from './Marelle.svelte';
  import DemandeDiagnosticSimplifiee from '../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
</script>

<div id="presentation">
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
    <DemandeDiagnosticSimplifiee origine="directive-nis2" titre="Commencez à agir pour protéger  votre organisation des cyberattaques"/>
  </dsfr-container>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .introduction {
    margin-inline: auto;
    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
    }
  }

  .marelle {
    background-color: #f6f6f6;
    padding-block: 72px;
  }

  .diagnostic {
    padding: 4.5rem 0;
  }
</style>
