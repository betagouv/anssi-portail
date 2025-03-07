<script lang="ts">
  import { validationChamp } from '../directives/validationChamp';

  export let nom: string;
  export let id: string;
  export let valeur: string = '';
  export let requis: boolean = false;
  export let aideSaisie: string = '';
  export let messageErreur: string = '';
  export let modele: string | undefined = undefined;
  export let type: string = 'text';
  export let autocomplete: 'on' | 'off' | '' = '';

  const typeChamp = (node: HTMLInputElement) => {
    node.type = type;
  };
</script>

<input
  class="champTexte"
  use:typeChamp
  {id}
  name={nom}
  bind:value={valeur}
  required={requis}
  placeholder={aideSaisie}
  use:validationChamp={requis || modele ? messageErreur : ''}
  pattern={modele}
  on:input
  on:focus
  {autocomplete}
/>

