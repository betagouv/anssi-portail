<script lang="ts">
  import type { NiveauMaturite } from '../niveaux-maturite/NiveauxMaturite.type';

  export let niveau: NiveauMaturite;

  $: afficheDiagnostic =
    niveau.id === 'insuffisant' ||
    niveau.id === 'emergent' ||
    niveau.id === 'intermediaire';
</script>

{#if afficheDiagnostic}
  <section class="encart fond-clair">
    <div class="contenu-section">
      <div class="carte parcours cyber-depart">
        <img
          src="/assets/images/dragon-kart.svg"
          alt="Illustration diagnostic cyber"
          class="illustration"
        />
        <h2>Bénéficiez d’un diagnostic cyber gratuit</h2>
        <p>
          Vous souhaitez
          <b>protéger votre organisation contre les cyberattaques</b>
          mais ne savez pas par quoi commencer ?
          <b>Prenez votre cyberdépart</b> avec un
          <b>premier diagnostic gratuit</b>
          et anonyme d'une heure dans vos locaux ou en visio
          <b>accompagné par un Aidant cyber</b>.
        </p>
        <a href="/cyberdepart" class="bouton primaire">
          Demander mon diagnostic cyber
        </a>
      </div>
    </div>
  </section>
{:else}
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
