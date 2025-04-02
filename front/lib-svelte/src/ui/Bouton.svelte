<script lang="ts">
  export let titre: string;
  export let type: 'primaire' | 'secondaire';
  export let actif: boolean = true;
  export let enCoursEnvoi: boolean = false;
  export let boutonSoumission: boolean = true;
  export let classe: string = '';
  export let icone: '' | 'partager' = '';
</script>

<button
  class="bouton {type} {classe} {icone}"
  class:avecIcone={!!icone}
  type={boutonSoumission ? 'submit' : 'button'}
  on:click
  disabled={!actif || enCoursEnvoi}
  class:en-cours-chargement={enCoursEnvoi}
>
  {titre}
</button>

<style>
  .bouton {
    align-items: center;
    gap: 8px;
  }

  .avecIcone:before {
    content: '';
    display: inline-block;
    background-repeat: no-repeat;
    background-size: contain;
    width: 20px;
    height: 20px;
    line-height: 20px;
  }

  .avecIcone {
    text-wrap: nowrap;
  }

  .partager:before {
    background-image: url('/assets/images/icone-partager.svg');
  }
</style>
