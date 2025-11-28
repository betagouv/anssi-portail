<script lang="ts">
  import type { NiveauMaturite } from '../niveaux-maturite/NiveauxMaturite.type';

  export let niveau: NiveauMaturite;

  $: afficheDiagnostic =
    niveau.id === 'insuffisant' ||
    niveau.id === 'emergent' ||
    niveau.id === 'intermediaire';
</script>

{#if !afficheDiagnostic}
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
{/if}
