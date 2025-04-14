<script lang="ts">
  export let titre: string;
  export let type: 'primaire' | 'secondaire';
  export let taille: 'md' | undefined = undefined;
  export let actif: boolean = true;
  export let enCoursEnvoi: boolean = false;
  export let boutonSoumission: boolean = true;
  export let classe: string = '';
  export let icone: '' | 'partager' = '';
</script>

<button
  class={`bouton ${type} ${classe} ${icone} ${taille ? `bouton-${taille}` : ''}`}
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

  .bouton-md {
    padding: 8px 16px;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem;
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
