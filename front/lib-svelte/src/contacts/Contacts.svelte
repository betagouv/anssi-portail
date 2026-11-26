<script lang="ts">
  import { untrack } from 'svelte';

  import { estCodeSecteurContact } from '@anssi-portail/contacts-sectoriels';

  import { creeLeFragmentDeNavigation } from '@navigation/fragmentDeNavigation.svelte';
  import { profilStore } from '@stores/profil.store';
  import type { PropriétésFilAriane } from '@ui/filAriane';
  import FiltresBureau from '@ui/FiltresBureau.svelte';
  import FiltresMobile from '@ui/FiltresMobile.svelte';
  import Heros from '@ui/Heros.svelte';

  import CarteContactCampus from './CarteContactCampus.svelte';
  import CarteContactCOT from './CarteContactCOT.svelte';
  import CarteContactCSIRT from './CarteContactCSIRT.svelte';
  import CarteContactNational from './CarteContactNational.svelte';
  import CarteContactSectoriel from './CarteContactSectoriel.svelte';
  import { estCodeRegion, type ContactsInitiaux } from './contacts.type';
  import FiltresContacts from './FiltresContacts.svelte';
  import NoteInformation from './NoteInformation.svelte';

  type Props = {
    contactsInitiaux?: ContactsInitiaux;
    regionInitiale?: string;
  };

  const { contactsInitiaux, regionInitiale = '' }: Props = $props();

  let regionSelectionnee: string = $state(untrack(() => regionInitiale));
  let secteurSelectionne: string = $state('');

  const contactsRegionaux = $derived(
    estCodeRegion(regionSelectionnee) ? contactsInitiaux?.regionaux[regionSelectionnee] : undefined
  );

  const contactSectoriel = $derived(
    estCodeSecteurContact(secteurSelectionne) ? contactsInitiaux?.sectoriels[secteurSelectionne] : undefined
  );

  let fragmentDeNavigation = $state(
    creeLeFragmentDeNavigation(untrack(() => (regionInitiale ? `#?region=${regionInitiale}` : undefined)))
  );

  const appliqueLesFiltres = () => {
    const parametreRegion = fragmentDeNavigation.extraisValeur('region', '');
    regionSelectionnee = estCodeRegion(parametreRegion) ? parametreRegion : '';
    const parametreSecteur = fragmentDeNavigation.extraisValeur('secteur', '');
    secteurSelectionne = estCodeSecteurContact(parametreSecteur) ? parametreSecteur : '';
  };

  $effect(() => appliqueLesFiltres());
  $effect(() => {
    fragmentDeNavigation.change('region', regionSelectionnee);
    fragmentDeNavigation.change('secteur', secteurSelectionne);
    fragmentDeNavigation.actualise();
  });

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Contacts cyber' };
</script>

<Heros
  description="Des contacts cyber de proximité pour vous orienter et répondre à vos questions."
  format="banniere"
  {propriétésFilAriane}
  theme="clair"
  titre="Contacts cyber"
/>

{#snippet filtres()}
  <FiltresContacts bind:regionSelectionnee bind:secteurSelectionne />
{/snippet}

{#if !$profilStore}
  <FiltresMobile filtreActif={false}>
    {@render filtres()}
  </FiltresMobile>
{/if}

<dsfr-container>
  <div class="contenu-section">
    {#if !$profilStore}
      <FiltresBureau filtreActif={false}>
        {@render filtres()}
      </FiltresBureau>
    {/if}

    {#if contactsRegionaux || contactSectoriel}
      <div class={['contacts', $profilStore ? 'centre' : '']}>
        <NoteInformation />

        {#if contactsRegionaux}
          <h2>Contacts régionaux</h2>

          {#if contactsRegionaux.COT}
            <CarteContactCOT contact={contactsRegionaux.COT} désignation={contactsRegionaux.designation} />
          {/if}

          {#if contactsRegionaux.CSIRT}
            <CarteContactCSIRT contact={contactsRegionaux.CSIRT} />
          {/if}

          {#if contactsRegionaux.campus}
            <CarteContactCampus contact={contactsRegionaux.campus} />
          {/if}
        {/if}

        {#if contactSectoriel}
          <h2>Contacts sectoriels</h2>
          <CarteContactSectoriel contact={contactSectoriel} />
        {/if}

        <h2>Contacts nationaux</h2>

        {#each contactsInitiaux?.nationaux ?? [] as contactNational (contactNational.nom)}
          <CarteContactNational contact={contactNational} />
        {/each}
      </div>
    {:else}
      <div class="aucun-resultat">
        <NoteInformation />
        <img src="/assets/images/contacts-resultat-vide.svg" width="188" height="171" alt="Aucun résultat" />
        <h5>Sélectionnez une région ou un secteur d’activité depuis le menu de filtres.</h5>
      </div>
    {/if}
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  * {
    box-sizing: border-box;
  }

  dsfr-container {
    padding: 48px 0 72px;

    .contenu-section {
      display: flex;
      @include a-partir-de(md) {
        gap: 1.5rem;
      }
    }
  }

  h2 {
    margin: 0;
  }

  h2 {
    margin: 8px 0 0 0;
    font-size: 2rem;
    line-height: 2.5rem;
  }

  .contacts {
    display: flex;
    flex-direction: column;
    gap: 24px;

    &.centre {
      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(8);
        margin-left: auto;
        margin-right: auto;
      }
    }
  }

  .aucun-resultat {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 16px;

    img {
      width: 187px;
    }

    h5 {
      font-size: 1.25rem;
      line-height: 1.75rem;
      margin: 0 0 24px;
      max-width: 588px;
      text-align: center;

      @include a-partir-de(md) {
        font-size: 1.375rem;
      }
    }
  }
</style>
