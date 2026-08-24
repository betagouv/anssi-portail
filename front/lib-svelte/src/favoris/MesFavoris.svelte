<script lang="ts">
  import { onMount } from 'svelte';
  import { chargeGuidesDansLeStore } from '../catalogue/stores/guides/guides.store';
  import { itemsCatalogueEnFavori } from '../catalogue/stores/itemsCatalogueEnFavori';
  import { profilStore } from '../stores/profil.store';
  import Bouton from '../ui/Bouton.svelte';
  import { fabriqueFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';
  import IllustrationDragonPasDeResultat from '../ui/IllustrationDragonPasDeResultat.svelte';
  import Lien from '../ui/Lien.svelte';
  import ContenuFavoris from './ContenuFavoris.svelte';

  const partageLien = () => {
    const hote = new URL(window.location.href).origin;
    const urlPartagee = `${hote}/favoris-partages/${$profilStore?.idListeFavoris}`;
    navigator.clipboard.writeText(urlPartagee).then(() => {
      alert('Adresse copiée dans le presse-papier.');
    });
  };
  onMount(chargeGuidesDansLeStore);
</script>

<Heros
  titre="Services et ressources favoris"
  description="Retrouvez tous vos contenus cyber à partager."
  format="banniere"
  theme="clair"
  segmentsFilAriane={fabriqueFilAriane({ feuille: 'Favoris' }, !!$profilStore)}
/>

<dsfr-container>
  <div class="favoris">
    {#if $itemsCatalogueEnFavori.length === 0}
      <div class="contenu-sans-favoris">
        <IllustrationDragonPasDeResultat texteAlternatif="Aucun favori sauvegardé" />
        <h2>Ajoutez vos services et ressources favoris et partagez-les facilement au sein de votre organisation.</h2>
        <Lien href="/catalogue" apparence="bouton" taille="lg" libelle="Explorer le catalogue"></Lien>
      </div>
    {:else}
      <div class="banniere-partage-favoris">
        <p>
          Une liste de favoris bien pensée est la clé pour sensibiliser efficacement vos équipes à la cybersécurité.
        </p>
        <Bouton type="primaire" libelle="Partager mes favoris" icone="share-line" surClic={partageLien} />
      </div>
      <ContenuFavoris avecBoutonFavori itemsEnFavori={$itemsCatalogueEnFavori} />
    {/if}
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  dsfr-container {
    padding: 16px 0;
  }

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

  .banniere-partage-favoris {
    background-color: var(--background-alt-blue-france);
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    margin-bottom: 32px;

    p {
      font-weight: bold;
      font-size: 1.125rem;
      line-height: 1.75rem;
      margin: 0;
      padding: 0;
    }

    @include a-partir-de(sm) {
      align-items: flex-start;
    }

    @include a-partir-de(lg) {
      flex-direction: row;
    }
  }
</style>
