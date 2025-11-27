<script lang="ts">
  import { Typologie } from './Catalogue.types';
  import { rechercheParTypologie } from './stores/rechercheParTypologie.store';
  import { nombreResultats } from './stores/nombreResultats.store';
</script>

<fieldset>
  <legend>Type</legend>
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
    <span class="compte"
      >{$nombreResultats.parTypologie[Typologie.SERVICE]}</span
    >
  </label>
  <label>
    <input
      type="checkbox"
      value={Typologie.OUTIL}
      bind:group={$rechercheParTypologie}
    />
    <span class="libelle"
    ><img
      src="/assets/images/icone-outil.svg"
      alt="Logo outils"
    />Outils</span
    >
    <span class="compte"
    >{$nombreResultats.parTypologie[Typologie.OUTIL]}</span
    >
  </label>
  <label>
    <input
      type="checkbox"
      value={Typologie.CONTENU}
      bind:group={$rechercheParTypologie}
    />
    <span class="libelle"
    ><img
      src="/assets/images/icone-contenu.svg"
      alt="Logo contenus"
    />Contenus</span
    >
    <span class="compte"
    >{$nombreResultats.parTypologie[Typologie.CONTENU]}</span
    >
  </label>
</fieldset>
