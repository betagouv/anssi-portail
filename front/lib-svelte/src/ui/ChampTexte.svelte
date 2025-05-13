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
  export let disabled: boolean = false;

  const typeChamp = (node: HTMLInputElement) => {
    node.type = type;
  };
</script>

<input
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
  {disabled}
  maxlength={$$restProps.maxlength}
  class={'champTexte ' + ($$restProps.class ?? '')}
/>

<style lang="scss">
  input.champTexte {
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: none;
    border-bottom: 2px solid #3a3a3a;
    font-size: 1rem;
    padding: 8px;
    line-height: 1.5rem;
    background: #eee;
    margin-bottom: 0;
    box-sizing: border-box;
    font-family: var(--fonts);
  }
</style>
