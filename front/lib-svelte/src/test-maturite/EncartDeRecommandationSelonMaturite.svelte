<script lang="ts">
  import type { NiveauMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees.js';

  export let niveau: NiveauMaturite;

  $: afficheDiagnostic =
    niveau.id === 'insuffisant' || niveau.id === 'emergent';
  $: afficheParcoursApprofondir = niveau.id === 'intermediaire';
  $: afficheCatalogue = niveau.id === 'optimal' || niveau.id === 'confirme';
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
          et anonyme d'une heure dans vos locaux
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
      {#if afficheParcoursApprofondir}
        <div class="tuile parcours">
          <img src="/assets/images/approfondir-cyber.png" alt="" />
          <h3>Les services pour approfondir la cybersécurité</h3>
          <p>
            Découvrez les services et les ressources pour aider votre
            organisation à approfondir la démarche de renforcement de la
            cybersécurité.
          </p>
          <a href="/parcours-approfondir" class="bouton primaire">Découvrir</a>
        </div>
      {:else if afficheCatalogue}
        <div class="tuile">
          <img src="/assets/images/debuter-cyber.png" alt="" />
          <h3>Les services et ressources cyber</h3>
          <p>
            Trouvez les services et les ressources adaptés à vos besoins et
            votre maturité cyber.
          </p>
          <a href="/catalogue" class="bouton primaire">Découvrir</a>
        </div>
      {/if}
    </div>
  </section>
{/if}
