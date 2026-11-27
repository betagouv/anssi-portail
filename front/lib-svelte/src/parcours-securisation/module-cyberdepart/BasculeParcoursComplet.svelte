<script lang="ts">
  import { DsfrCallout } from '@lab-anssi/ui-kit';
  import { onMount } from 'svelte';

  import Lien from '@ui/Lien.svelte';
  import MiseEnAvant from '@ui/MiseEnAvant.svelte';

  let pageSource = $state('');

  onMount(() => {
    pageSource = `${window.location.pathname}-bascule-parcours-complet`;
  });
</script>

<DsfrCallout
  text="Passez au niveau supérieur et continuez à progresser avec des mesures plus avancées pour renforcer vos pratiques,
    mieux structurer vos actions et protéger votre organisation dans la durée."
  title="Protégez votre organisation dans la durée"
  titleMarkup="h4"
  buttonLabel="En savoir plus"
  icon="info-line"
  accent="blue-ecume"
  hasTitle
  hasButton
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
</DsfrCallout>

<MiseEnAvant
  accent="blue-ecume"
  libelléBouton="En savoir plus"
  niveauTitre={4}
  texte="Passez au niveau supérieur et continuez à progresser avec des mesures plus avancées pour renforcer vos pratiques,
    mieux structurer vos actions et protéger votre organisation dans la durée."
  titre="Protégez votre organisation dans la durée"
>
  {#snippet bouton()}
    <Lien
      apparence="bouton"
      libelle="Poursuivre le parcours"
      etire
      icone="arrow-right-circle-line"
      iconeADroite
      href={`/parcours-complet?pageSource=${pageSource}`}
    />
  {/snippet}
</MiseEnAvant>
