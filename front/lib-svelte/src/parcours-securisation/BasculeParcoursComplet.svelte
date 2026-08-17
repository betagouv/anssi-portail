<script lang="ts">
  import { onMount } from 'svelte';
  import Lien from '../ui/Lien.svelte';

  let pageSource = $state('');

  onMount(() => {
    pageSource = `${window.location.pathname}#bascule-parcours-complet`;
  });
</script>

<dsfr-callout
  text="Passer au niveau supérieur et continuez à progresser avec des mesures plus avancées pour renforcer vos pratiques,
    mieux structurer vos actions et protéger votre organisation dans la durée."
  title="Protégez votre organisation dans la durée"
  title-markup="h4"
  button-label="En savoir plus"
  icon="info-line"
  accent="blue-ecume"
  has-title
  has-button
>
  <div slot="button">
    <Lien
      apparence="bouton"
      libelle="Poursuivre le parcours"
      etire
      icone="arrow-right-circle-line"
      iconeADroite
      href={`/parcours-complet?pageSource=${pageSource}`}
    />
  </div>
</dsfr-callout>
