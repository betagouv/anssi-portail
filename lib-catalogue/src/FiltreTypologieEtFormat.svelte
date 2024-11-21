<script lang="ts">
  import {DroitAcces, FormatRessource, Typologie} from "./Catalogue.types";
  import { rechercheParTypologie } from "./stores/rechercheParTypologie.store";
  import { rechercheParFormat } from "./stores/rechercheParFormat.store";
  import {nombreResultats} from "./stores/nombreResultats.store";

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
    <span class="compte">{$nombreResultats.parTypologie[Typologie.SERVICE]}</span>
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
    <span class="compte">{$nombreResultats.parTypologie[Typologie.RESSOURCE]}</span>
  </label>
  <fieldset>
    <label>
      <input
        type="checkbox"
        value={FormatRessource.PDF}
        bind:group={$rechercheParFormat}
      />
      <span class="libelle">Pdf</span>
      <span class="compte">{$nombreResultats.parFormatDeRessource[FormatRessource.PDF]}</span>
    </label>
    <label>
      <input
        type="checkbox"
        value={FormatRessource.VIDEO}
        bind:group={$rechercheParFormat}
      />
      <span class="libelle">Vidéos</span>
      <span class="compte">{$nombreResultats.parFormatDeRessource[FormatRessource.VIDEO]}</span>
    </label>
    <label>
      <input
        type="checkbox"
        value={FormatRessource.LISTES}
        bind:group={$rechercheParFormat}
      />
      <span class="libelle">Listes</span>
      <span class="compte">{$nombreResultats.parFormatDeRessource[FormatRessource.LISTES]}</span>
    </label>
  </fieldset>
</fieldset>
