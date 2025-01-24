<script lang="ts">
  export let parcours: "debuter" | "approfondir";
</script>

<div class="tuile parcours">
  <img src="/assets/images/{parcours}-cyber.png" alt="">
  <h3>Votre parcours cyber</h3>
  <p>
    Identifiez vos actions prioritaires grâce à un parcours dédié, regroupant
    des services et ressources adaptés à vos besoins et à la maturité cyber de
    votre organisation.
  </p>
  <a href="/parcours-{parcours}" class="bouton primaire">Accéder à mon parcours cyber</a>
</div>
