<script lang="ts">
  import { catalogueFiltre } from "./stores/catalogueFiltre.store";
  import FiltreBesoin from "./FiltreBesoin.svelte";
  import FiltreAccessibilite from "./FiltreAccessibilite.svelte";
  import FiltreTypologieEtFormat from "./FiltreTypologieEtFormat.svelte";
  import FiltreSource from "./FiltreSource.svelte";
  import FiltreTheme from "./FiltreTheme.svelte";
  import { rechercheParBesoin } from "./stores/rechercheParBesoin.store";
  import { rechercheParDroitAcces } from "./stores/rechercheParDroitAcces.store";
  import { rechercheParTypologie } from "./stores/rechercheParTypologie.store";
  import { rechercheParFormat } from "./stores/rechercheParFormat.store";
  import { rechercheParSource } from "./stores/rechercheParSource.store";
  import { rechercheParTheme } from "./stores/rechercheParTheme.store";

  const reinitialiseFiltres = () => {
    rechercheParBesoin.reinitialise();
    rechercheParDroitAcces.reinitialise();
    rechercheParTypologie.reinitialise();
    rechercheParFormat.reinitialise();
    rechercheParSource.reinitialise();
    rechercheParTheme.reinitialise();
  };
</script>

<div class="recherche">
  <div class="sommaire sommaire-replie">
    <details>
      <summary>
        <img class="menu" src="/assets/images/icone-filtre-vide.svg" alt="Icône filtre"/>
        <span class="titre-menu">Filtres</span>
        <img class="chevron" src="/assets/images/icone-chevron-bas.svg" alt="Chevron ouverture" />
      </summary>

      <div class="barre-filtres">
        <FiltreBesoin />
        <FiltreAccessibilite />
        <FiltreTypologieEtFormat />
        <FiltreSource />
        <FiltreTheme />
        <input
          type="button"
          class="bouton primaire"
          value="Réinitialiser les filtres"
          on:click={reinitialiseFiltres}
        />
      </div>
    </details>
  </div>

  <div class="liste">
    {#each $catalogueFiltre.resultats as service}
      <div class="carte service">
        <figure>
          <img
            src="/assets/images/illustrations-services/{service.illustration}"
            alt="Illustration du service"
          />
          <figcaption>Service</figcaption>
        </figure>
        <div class="contenu">
          <h3>{@html service.nom}</h3>
          <span>{@html service.description}</span>
          <a href={service.lienInterne}>
            En savoir plus
            <img
              src="/assets/images/icone-fleche-droite.svg"
              alt="En savoir plus"
            />
          </a>
          <div class="labels">
            {#each service.sources as source}<span>{source}</span>{/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<div class="encart fond-sombre">
  <h1>Nos parcours adaptés à votre maturité cyber</h1>
  <div class="carte parcours">
    <img src="/assets/images/debuter-cyber.png" alt="Illustration débutant cyber"/>
    <h2>Débuter en cyberbersécurité</h2>
    <p>Vous débutez en cyber ou vous avez besoin de solidifier vous connaissances ? Quelques actions simples pourraient améliorer votre sécurité. L’ANSSI vous propose des solutions pour y arriver.</p>
    <a href="#">Découvrir le parcours</a>
  </div>
  <div class="carte parcours">
    <img src="/assets/images/approfondir-cyber.png" alt="Illustration approfondir cyber"/>
    <h2>Approfondir la cybersécurité</h2>
    <p>Vous connaissez les bases de la cyber mais quelques actions simples pourraient améliorer votre sécurité. L’ANSSI vous propose des solutions pour y arriver.</p>
    <a href="#">Découvrir le parcours</a>
  </div>
</div>

<div  class="encart fond-clair">
  <div class="carte test-maturite">
    <img src="/assets/images/trouver-parcours.png" alt="Illustration trouver parcours"/>
    <h1>Trouvez le parcours cyber adapté</h1>
    <p>Faites le test et découvrez nos parcours cyber adaptés au niveau de maturité de votre entité.</p>
    <a href="#" class="bouton primaire">Testez maturité cyber</a>
  </div>
</div>

<style>
</style>
