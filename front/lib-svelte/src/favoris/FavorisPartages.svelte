<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { ItemCyber } from '../catalogue/Catalogue.types';
  import type { Guide } from '../catalogue/Guide.types';
  import { catalogueStore } from '../catalogue/stores/catalogue.store';
  import {
    chargeGuidesDansLeStore,
    guidesStore,
  } from '../catalogue/stores/guides/guides.store';
  import { listeItemsFavoris } from '../catalogue/stores/itemsCatalogueEnFavori';
  import { profilStore } from '../stores/profil.store';
  import Hero from '../ui/Hero.svelte';
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
      itemsCyberPartages = listeItemsFavoris(
        reponse.data.favorisPartages,
        $catalogueStore.items,
        $guidesStore
      );
    } catch {
      prenom = '?';
      itemsCyberPartages = [];
    }
  });
</script>

<Hero
  description={`Cette liste de services et ressources est partagée par ${prenom}`}
  titre="Services et ressources partagés"
  ariane="Services et ressources partagés"
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
        <ContenuFavoris
          avecBoutonFavori={estConnecte}
          itemsEnFavori={itemsCyberPartages}
        />
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
        {#if estConnecte}
          <h2>Découvrez plus de services et ressources cyber</h2>
          <p>
            Accédez aux services et ressources cyber proposés par l’ANSSI et ses
            partenaires.
          </p>
          <a href="/catalogue/" class="bouton primaire">Explorer le catalogue</a
          >
        {:else}
          <h2>Créez votre propre liste de favoris !</h2>
          <p>
            Créez-vous un compte MesServicesCyber, explorez le catalogue et
            sauvegardez facilement les services et ressources utiles pour votre
            organisation.
          </p>
          <a href="/connexion/" class="bouton primaire">
            Connectez-vous sur MesServicesCyber
          </a>
        {/if}
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
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

  section {
    padding: 72px var(--gouttiere);
  }

  .encart {
    .carte.parcours {
      display: grid;
      gap: 24px 16px;

      grid-template-columns: auto;
      grid-template-rows: auto;
      grid-template-areas:
        'illustration'
        'titre'
        'contenu'
        'bouton';

      @include a-partir-de(lg) {
        grid-template-columns: auto 384px;
        grid-template-areas:
          'titre illustration'
          'contenu illustration'
          'bouton illustration';
      }

      .illustration {
        grid-area: illustration;
        @include a-partir-de(lg) {
          height: 205px;
          padding: 38px 51px;
        }
      }

      h2 {
        grid-area: titre;
        @include a-partir-de(lg) {
          font-size: 2.5rem;
          line-height: 3rem;
        }
      }

      p {
        grid-area: contenu;
        font-size: 1.25rem;
        line-height: 2rem;
      }

      .bouton.primaire {
        text-align: center;
        border-bottom: none;
        margin-top: 32px;
        padding: 10px 24px;
        grid-area: bouton;
        place-self: center;

        &:after {
          content: none;
        }

        @include a-partir-de(sm) {
          width: auto;
        }

        @include a-partir-de(lg) {
          width: fit-content;
          justify-self: flex-start;
          margin-top: 16px;
        }
      }
    }
  }
</style>
