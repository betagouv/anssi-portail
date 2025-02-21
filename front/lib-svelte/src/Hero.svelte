<script lang="ts">
  export let titre: string;
  export let description: string;
</script>

<section class="chapeau fond-sombre">
  <div class="contenu-section">
    <div class="fil-ariane">
      <a href="/" class="lien">Accueil</a>
      <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /> </span>
      <span>Tester votre maturité cyber</span>
    </div>
    <h1>{titre}</h1>
    <p>{description}</p>
  </div>
</section>
