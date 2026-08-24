<script lang="ts">
  import { afficheNouvelleDA } from '$plateforme/environnement';
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { ItemCyber } from '../catalogue/Catalogue.types';
  import type { Guide } from '../catalogue/Guide.types';
  import { catalogueStore } from '../catalogue/stores/catalogue.store';
  import { chargeGuidesDansLeStore, guidesStore } from '../catalogue/stores/guides/guides.store';
  import { listeItemsFavoris } from '../catalogue/stores/itemsCatalogueEnFavori';
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import IllustrationDragonPasDeResultat from '../ui/IllustrationDragonPasDeResultat.svelte';
  import ContenuFavoris from './ContenuFavoris.svelte';

  let prenom: string = '';
  let itemsCyberPartages: (ItemCyber | Guide)[] = [];

  type FavorisPartagesAPI = {
    prenom: string;
    favorisPartages: string[];
  };

  let urlDemandee = new URL(window.location.href).pathname;

  $: estConnecte = !!$profilStore;

  onMount(async () => {
    try {
      const reponse = await axios.get<FavorisPartagesAPI>(`/api${urlDemandee}`);
      prenom = reponse.data.prenom;
      await chargeGuidesDansLeStore();
      itemsCyberPartages = listeItemsFavoris(reponse.data.favorisPartages, $catalogueStore.items, $guidesStore);
    } catch {
      prenom = '?';
      itemsCyberPartages = [];
    }
  });
  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Services et ressources partagés', fondSombre: true };
</script>

<Heros
  description={`Cette liste de services et ressources est partagée par ${prenom}`}
  format="banniere"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
  theme={afficheNouvelleDA ? 'clair' : 'sombre'}
  titre="Services et ressources partagés"
>
  {#snippet filAriane()}
    <FilAriane {...propriétésFilAriane} />
  {/snippet}
</Heros>

<dsfr-container>
  <div class="contenu-section">
    <div class="favoris">
      {#if itemsCyberPartages.length === 0}
        <div class="contenu-sans-favoris">
          <IllustrationDragonPasDeResultat texteAlternatif="Aucun favori sauvegardé" />
          <h2>La liste de services et ressources est vide.</h2>
        </div>
      {:else}
        <ContenuFavoris avecBoutonFavori={estConnecte} itemsEnFavori={itemsCyberPartages} />
      {/if}
    </div>
  </div>
</dsfr-container>

<style lang="scss">
  .favoris {
    margin-top: 48px;
    margin-bottom: 48px;
  }

  .contenu-sans-favoris {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin: 72px auto 97px;
    max-width: 588px;
  }

  .contenu-sans-favoris h2 {
    text-align: center;
  }

  dsfr-container {
    padding: 72px 0;
  }
</style>
