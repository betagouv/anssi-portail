<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";

  type Profil = {
    prenom: string;
    nom: string;
    email: string;
    siret: string;
  };

  let profil: Profil | undefined;

  onMount(async () => {
    let reponse = await axios.get("/profil");
    let data = reponse.data as any;
    if (data.email) {
      profil = data as Profil;
    } else {
      profil = undefined;
    }
  });
</script>

<span>
  {#if profil === undefined}
    <a href="/connexion">Se connecter</a>
  {:else}
    {profil.prenom} {profil.nom}
  {/if}
</span>
