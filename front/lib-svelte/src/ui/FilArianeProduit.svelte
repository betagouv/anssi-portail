<script lang="ts">
  export let nom: string;
</script>

<div class="fil-ariane">
  <a href="/" class="lien">Accueil</a>
  <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /> </span>
  <a href="/catalogue/" class="lien">Les services et ressources cyber</a>
  <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /></span>
  <span>{@html nom}</span>
</div>
