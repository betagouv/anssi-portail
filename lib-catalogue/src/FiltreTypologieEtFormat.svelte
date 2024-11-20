<script lang="ts">
  import { FormatRessource, Typologie } from "./Catalogue.types";
  import { rechercheParTypologie } from "./stores/rechercheParTypologie.store";
  import { rechercheParFormat } from "./stores/rechercheParFormat.store";

  let ressourcesPartielles = false;
  $: if ($rechercheParFormat.length > 0) {
    ressourcesPartielles =
      $rechercheParFormat.length !== Object.keys(FormatRessource).length;
    rechercheParTypologie.ajouteLesRessources();
  } else {
    ressourcesPartielles = false;
    rechercheParTypologie.retireLesRessources();
  }

  const gereCocheRessources = () => {
    if (!$rechercheParTypologie.includes(Typologie.RESSOURCE)) {
      rechercheParFormat.ajouteTous();
    } else {
      rechercheParFormat.retireTous();
    }
  };
</script>

<fieldset>
  <legend>Services ou ressources</legend>
  <label>
    <input
      type="checkbox"
      value={Typologie.SERVICE}
      bind:group={$rechercheParTypologie}
    />
    <span class="libelle"
      ><img
        src="/assets/images/icone-service.svg"
        alt="Logo service"
      />Services</span
    >
    <span class="compte">2</span>
  </label>
  <label>
    <input
      type="checkbox"
      value={Typologie.RESSOURCE}
      bind:indeterminate={ressourcesPartielles}
      bind:group={$rechercheParTypologie}
      on:click={gereCocheRessources}
    />
    <span class="libelle"
      ><img
        src="/assets/images/icone-ressource.svg"
        alt="Logo ressource"
      />Ressources</span
    >
    <span class="compte">1</span>
  </label>
  <fieldset>
    <label>
      <input
        type="checkbox"
        value={FormatRessource.PDF}
        bind:group={$rechercheParFormat}
      />
      <span class="libelle">Pdf</span>
      <span class="compte">55</span>
    </label>
    <label>
      <input
        type="checkbox"
        value={FormatRessource.VIDEO}
        bind:group={$rechercheParFormat}
      />
      <span class="libelle">Vidéos</span>
      <span class="compte">55</span>
    </label>
    <label>
      <input
        type="checkbox"
        value={FormatRessource.LISTES}
        bind:group={$rechercheParFormat}
      />
      <span class="libelle">Listes</span>
      <span class="compte">55</span>
    </label>
  </fieldset>
</fieldset>
