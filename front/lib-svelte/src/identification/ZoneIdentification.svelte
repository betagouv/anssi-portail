<script lang="ts">
  import { profilStore } from '../stores/profil.store';
</script>

{#if $profilStore === undefined}
  <div class="profil-deconnecte">
    <a href="/connexion">Se connecter</a>
  </div>
{:else}
  <div class="profil-connecte">
    <span class="libelle-profil">{$profilStore.prenom} {$profilStore.nom}</span>
    <a href="/oidc/deconnexion">Se déconnecter</a>
  </div>
{/if}
