<script lang="ts">
  export let titre: string;
  export let type: 'primaire' | 'secondaire';
  export let actif: boolean = true;
  export let enCoursEnvoi: boolean = false;
  export let boutonSoumission: boolean = true;
  export let classe: string = '';
</script>

<button
  class="bouton {type} {classe}"
  type={boutonSoumission ? 'submit' : 'button'}
  on:click
  disabled={!actif || enCoursEnvoi}
  class:en-cours-chargement={enCoursEnvoi}
>
  {titre}
</button>
