<script lang="ts">
  import Bouton from '@ui/Bouton.svelte';
  import { copieDansLePressePapier } from '@ui/presse-papier';

  type Props = {
    code: string;
  };

  const { code }: Props = $props();

  const copyTexte = async (texte: string) => {
    const copié = await copieDansLePressePapier(texte);
    alert(copié ? 'Code copié dans le presse-papier.' : 'Échec de la copie dans le presse-papier.');
  };
</script>

<div>
  <code>
    {code}
  </code>

  <Bouton
    icone="clipboard-line"
    libelle="copier"
    surClic={() => copyTexte(code)}
    taille="sm"
    type="tertiaire-sans-bordure"
  ></Bouton>
</div>

<style lang="scss">
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0.5rem 0.75rem 1rem;
    background-color: var(--background-alt-grey);

    code {
      background-color: var(--background-alt-grey);
    }
  }
</style>
