<script lang="ts">
  export let parcours: 'debuter' | 'approfondir';
</script>

<div class="tuile parcours">
  <img src="/assets/images/{parcours}-cyber.png" alt="" />
  <h3>
    Les services pour {parcours === 'debuter'
      ? 'se lancer en'
      : 'approfondir la'} cybersécurité
  </h3>
  <p>
    {#if parcours === 'debuter'}
      Découvrez les services et les ressources pour aider votre organisation à
      se lancer dans une démarche de renforcement de la cybersécurité.
    {:else}
      Découvrez les services et les ressources pour aider votre organisation à
      approfondir la démarche de renforcement de la cybersécurité.
    {/if}
  </p>
  <a href="/parcours-{parcours}" class="bouton primaire">Découvrir</a>
</div>
