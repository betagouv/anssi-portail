<script lang="ts">
  import { catalogueFiltre } from "./stores/catalogueFiltre.store";
  import FiltreBesoin from "./FiltreBesoin.svelte";
  import FiltreAccessibilite from "./FiltreAccessibilite.svelte";
  import FiltreTypologieEtFormat from "./FiltreTypologieEtFormat.svelte";
  import FiltreSource from "./FiltreSource.svelte";
  import FiltreTheme from "./FiltreTheme.svelte";
  import { recherches } from "./stores/recherches.store";
  import CarteItem from "./CarteItem.svelte";
  import EnteteFiltres from "./EnteteFiltres.svelte";

  const reinitialiseFiltres = () => recherches.reinitialise();
</script>

<div class="recherche">
  <div class="sommaire sommaire-replie">
    <details>
      <summary>
        <EnteteFiltres />
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

  <div class="sommaire sommaire-deplie">
    <EnteteFiltres />
    <div class="barre-filtres">
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
  </div>

  <div class="liste">
    {#each $catalogueFiltre.resultats as itemCyber}
      <CarteItem {itemCyber} />
    {/each}
  </div>
</div>

<div class="encart fond-sombre">
  <h1>Nos parcours adaptés à votre maturité cyber</h1>
  <div class="liste-parcours">
    <div class="carte parcours">
      <img
        src="/assets/images/debuter-cyber.png"
        alt="Illustration débutant cyber"
      />
      <h2>Débuter en cyberbersécurité</h2>
      <p>
        Vous débutez en cyber ou vous avez besoin de solidifier vous
        connaissances ? Quelques actions simples pourraient améliorer votre
        sécurité. L’ANSSI vous propose des solutions pour y arriver.
      </p>
      <a href="/parcours-debuter">Découvrir le parcours</a>
    </div>
    <div class="carte parcours">
      <img
        src="/assets/images/approfondir-cyber.png"
        alt="Illustration approfondir cyber"
      />
      <h2>Approfondir la cybersécurité</h2>
      <p>
        Vous connaissez les bases de la cyber mais quelques actions simples
        pourraient améliorer votre sécurité. L’ANSSI vous propose des solutions
        pour y arriver.
      </p>
      <a href="/parcours-approfondir">Découvrir le parcours</a>
    </div>
  </div>
</div>

<div class="encart fond-clair">
  <div class="carte test-maturite">
    <img
      src="/assets/images/trouver-parcours.png"
      alt="Illustration trouver parcours"
    />
    <h1>Trouvez le parcours cyber adapté</h1>
    <p>
      Faites le test et découvrez nos parcours cyber adaptés au niveau de
      maturité de votre entité.
    </p>
    <a href="/test" class="bouton primaire">Testez votre maturité cyber</a>
  </div>
</div>

<style>
</style>
