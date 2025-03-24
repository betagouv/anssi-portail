<script lang="ts">
  import ContenuFavoris from './ContenuFavoris.svelte';
  import Hero from '../Hero.svelte';
  import type { ItemCyber } from '../catalogue/Catalogue.types';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { catalogueStore } from '../catalogue/stores/catalogue.store';

  let prenom: string = '';
  let itemsCyberPartages: ItemCyber[] = [];

  type FavorisPartagesAPI = {
    prenom: string;
    favorisPartages: string[];
  };

  let urlDemandee = new URL(window.location.href).pathname;

  onMount(async () => {
    try {
      const reponse = await axios.get<FavorisPartagesAPI>(`/api${urlDemandee}`);
      prenom = reponse.data.prenom;
      itemsCyberPartages = reponse.data.favorisPartages
        .map((idFavori) =>
          $catalogueStore.items.find((itemCyber) => itemCyber.id === idFavori)
        )
        .filter((item) => !!item);
    } catch (e) {
      prenom = '?';
      itemsCyberPartages = [];
    }
  });
</script>

<Hero
  description={`Cette liste de services et ressources est partagée par ${prenom}`}
  titre="Services et ressources partagés"
/>

<section>
  <div class="contenu-section">
    <div class="favoris">
      {#if itemsCyberPartages.length === 0}
        <div class="contenu-sans-favoris">
          <img
            src="/assets/images/illustration-dragon-aucun-resultat.svg"
            alt="Aucun favori sauvegardé"
          />
          <h2>La liste de services et ressources est vide.</h2>
        </div>
      {:else}
        <ContenuFavoris avecBoutonFavori itemsEnFavori={itemsCyberPartages} />
      {/if}
    </div>
  </div>
</section>

<section class="encart fond-sombre">
  <div class="contenu-section">
    <div class="liste-parcours">
      <div class="carte parcours">
        <img
          src="/assets/images/illustration-tester.svg"
          alt="Illustration découvrez plus de services et ressources cyber"
          class="illustration"
        />
        <h2>Découvrez plus de services et ressources cyber</h2>
        <p>
          Accédez aux services et ressources cyber proposés par l’ANSSI et ses
          partenaires.
        </p>
        <a href="/catalogue/" class="bouton primaire">Explorer le catalogue</a>
      </div>
    </div>
  </div>
</section>
