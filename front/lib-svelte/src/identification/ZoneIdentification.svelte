<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';

  type Profil = {
    prenom: string;
    nom: string;
    email: string;
    siret: string;
  };

  let profil: Profil | undefined;

  onMount(async () => {
    let reponse = await axios.get('/api/profil');
    let data = reponse.data as any;
    if (data.email) {
      profil = data as Profil;
    } else {
      profil = undefined;
    }
  });
</script>

{#if profil === undefined}
  <div class="profil-deconnecte">
    <a href="/connexion">Se connecter</a>
  </div>
{:else}
  <div class="profil-connecte">
    <span class="libelle-profil">{profil.prenom} {profil.nom}</span>
    <a href="/oidc/deconnexion">Se déconnecter</a>
  </div>
{/if}
