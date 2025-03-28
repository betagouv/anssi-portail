<script lang="ts">
  import { itemsCatalogueEnFavori } from '../catalogue/stores/itemsCatalogueEnFavori';
  import ContenuFavoris from './ContenuFavoris.svelte';
  import Bouton from '../ui/Bouton.svelte';
  import { profilStore } from '../stores/profil.store';
  import FilAriane from '../ui/FilAriane.svelte';

  const partageLien = () => {
    const hote = new URL(window.location.href).origin;
    const urlPartagee = `${hote}/favoris-partages/${$profilStore?.idListeFavoris}`;
    navigator.clipboard.writeText(urlPartagee).then(() => {
      alert('Adresse copiée dans le presse papier.');
    });
  };
</script>

<section class="chapeau fond-sombre">
  <div class="contenu-section">
    <FilAriane feuille="Favoris" />
    <h1>Services et ressources favoris</h1>
    <p>Retrouvez tous vos contenus cyber à partager.</p>
    {#if $itemsCatalogueEnFavori.length > 0}
      <div class="cta">
        <p>
          Parcourez le catalogue pour ajouter plus de services et ressources.
        </p>
        <a href="/catalogue/" class="bouton primaire">Explorer le catalogue</a>
      </div>
    {/if}
  </div>
</section>

<section>
  <div class="contenu-section">
    <div class="favoris">
      {#if $itemsCatalogueEnFavori.length === 0}
        <div class="contenu-sans-favoris">
          <img
            src="/assets/images/illustration-dragon-aucun-resultat.svg"
            alt="Aucun favori sauvegardé"
          />
          <h2>
            Ajoutez vos services et ressources favoris et partagez-les
            facilement au sein de votre organisation.
          </h2>
          <a href="/catalogue" class="bouton primaire">Explorer le catalogue</a>
        </div>
      {:else}
        <div class="banniere-partage-favoris">
          <p>
            Une liste de favoris bien pensée est la clé pour sensibiliser
            efficacement vos équipes à la cybersécurité.
          </p>
          <Bouton
            type="primaire"
            titre="Partager mes favoris"
            icone="partager"
            on:click={partageLien}
          />
        </div>
        <ContenuFavoris
          avecBoutonFavori
          itemsEnFavori={$itemsCatalogueEnFavori}
        />
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  @media (min-width: 992px) {
    .chapeau.fond-sombre {
      padding-bottom: 48px;
    }
  }

  .chapeau.fond-sombre h1 {
    grid-area: titre;
    margin: 16px 0;
    @include a-partir-de(md) {
      font-size: 48px;
      margin: 8px 0;
    }
  }

  section {
    padding: 16px var(--gouttiere);
  }

  .chapeau.fond-sombre {
    padding: 32px var(--gouttiere) 48px;
    .contenu-section {
      display: grid;
      column-gap: 24px;
      grid-template-areas: 'ariane' 'titre' 'description' 'cta';
    }
  }

  @include a-partir-de(lg) {
    .chapeau.fond-sombre .contenu-section {
      grid-template-columns: auto 384px;
      grid-template-areas: "ariane cta" 'titre cta' 'description cta';
    }
  }

  .chapeau.fond-sombre p {
    grid-area: description;
  }

  .chapeau.fond-sombre .cta {
    align-self: center;
    grid-area: cta;
    p {
      font-size: 18px;
      @include a-partir-de(md) {
        font-size: 20px;
      }
    }
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

  :global(.carte.service),
  :global(.carte.ressource) {
    display: flex;
    flex-direction: column;
    width: auto;
  }

  .banniere-partage-favoris {
    background-color: #fef6e3;
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
      button {
        text-wrap: nowrap;
      }
    }
  }
</style>
