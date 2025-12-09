<script lang="ts">
  import type { NiveauMaturite } from '../niveaux-maturite/NiveauxMaturite.type';
  import { profilStore } from '../stores/profil.store';
  import Separateur from '../ui/Separateur.svelte';
  import EncartDeRecommandationMaturiteFaible from './EncartDeRecommandationMaturiteFaible.svelte';
  import EncartDeRecommandationMaturiteForte from './EncartDeRecommandationMaturiteForte.svelte';

  export let niveau: NiveauMaturite;

  $: afficheDiagnostic =
    niveau.id === 'insuffisant' ||
    niveau.id === 'emergent' ||
    niveau.id === 'intermediaire';
</script>

{#if afficheDiagnostic}
  <Separateur />
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
  <Separateur />
  <EncartDeRecommandationMaturiteForte />
{/if}
