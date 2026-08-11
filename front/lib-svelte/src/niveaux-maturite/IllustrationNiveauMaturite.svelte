<script lang="ts">
  import type { NiveauMaturite } from './NiveauxMaturite.type';
  import { afficheNouvelleDA } from '$plateforme/environnement';

  export let niveauSelectionne: NiveauMaturite;
</script>

<div class="illustration">
  <img
    src="/assets/images/test-maturite/niveaux/{niveauSelectionne.id}{afficheNouvelleDA ? '-nouvelle-da' : ''}.svg"
    alt={`Illustration niveau ${niveauSelectionne.label}`}
  />
</div>
