<script lang="ts">
  import Lien from '../ui/Lien.svelte';
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
      href="/parcours-complet"
    />
  </div>
</dsfr-callout>
