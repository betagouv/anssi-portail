<script lang="ts">
  import type { NiveauMaturite } from '../niveaux-maturite/NiveauxMaturite.type';
  import { profilStore } from '../stores/profil.store';
  import EncartDeRecommandationMaturiteFaible from './EncartDeRecommandationMaturiteFaible.svelte';
  import EncartDeRecommandationMaturiteForte from './EncartDeRecommandationMaturiteForte.svelte';

  export let niveau: NiveauMaturite;

  $: afficheDiagnostic =
    niveau.id === 'insuffisant' ||
    niveau.id === 'emergent' ||
    niveau.id === 'intermediaire';
</script>

<section class="separation">
  <div class="contenu-section">
    <hr />
  </div>
</section>
{#if afficheDiagnostic}
  <EncartDeRecommandationMaturiteFaible />
{:else if $profilStore}
  <section class="votre-parcours">
    <div class="contenu-section">
      <div class="tuile">
        <img src="/assets/images/debuter-cyber.png" alt="" />
        <h3>Les services et ressources cyber</h3>
        <p>
          Trouvez les services et les ressources adaptés à vos besoins et votre
          maturité cyber.
        </p>
        <a href="/catalogue" class="bouton primaire">Découvrir</a>
      </div>
    </div>
  </section>
{:else}
  <EncartDeRecommandationMaturiteForte />
{/if}

<style lang="scss">
  section.separation {
    padding-block: 0;

    hr {
      height: 1px;
      border: 0;
      background-color: #dddddd;
    }
  }
</style>
