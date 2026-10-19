<script lang="ts">
  import { estCodeSecteurContact } from '@anssi-portail/contacts-sectoriels';
  import { untrack } from 'svelte';
  import { creeLeFragmentDeNavigation } from '../navigation/fragmentDeNavigation.svelte';
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import FiltresBureau from '../ui/FiltresBureau.svelte';
  import FiltresMobile from '../ui/FiltresMobile.svelte';
  import Heros from '../ui/Heros.svelte';
  import Lien from '../ui/Lien.svelte';
  import CarteContact from './CarteContact.svelte';
  import { estCodeRegion, type ContactsInitiaux } from './contacts.type';
  import FiltresContacts from './FiltresContacts.svelte';
  import LigneContact from './LigneContact.svelte';
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

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Contacts cyber', fondSombre: true };
</script>

<Heros
  description="Des contacts cyber de proximité pour vous orienter et répondre à vos questions."
  format="banniere"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
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
            {@const { nom, email } = contactsRegionaux.COT}
            <CarteContact titre="Délégué(e)s ANSSI de votre {contactsRegionaux.designation}">
              <LigneContact type="nom" valeur={nom} />
              <LigneContact type="email" valeur={email} />
            </CarteContact>
          {/if}

          {#if contactsRegionaux.CSIRT}
            {@const { nom, telephone, siteWeb, adresse } = contactsRegionaux.CSIRT}
            <CarteContact titre={nom}>
              {#if telephone}
                <LigneContact type="telephone" valeur={telephone} />
              {/if}
              <LigneContact type="site-web" valeur={siteWeb} />
              {#if adresse}
                <LigneContact type="adresse" valeur={adresse} />
              {/if}
            </CarteContact>
          {/if}

          {#if contactsRegionaux.campus}
            {@const { nom, siteWeb, adresse, email } = contactsRegionaux.campus}
            <CarteContact titre={nom}>
              {#if email}
                <LigneContact type="email" valeur={email} />
              {/if}
              <LigneContact type="site-web" valeur={siteWeb} />
              <LigneContact type="adresse" valeur={adresse} />
            </CarteContact>
          {/if}
        {/if}

        {#if contactSectoriel}
          <h2>Contacts sectoriels</h2>
          <CarteContact titre={contactSectoriel.nom}>
            <LigneContact type="site-web" valeur={contactSectoriel.siteWeb} />
          </CarteContact>
        {/if}

        <h2>Contacts nationaux</h2>

        {#each contactsInitiaux?.nationaux ?? [] as { nom, description, contacts, lienPrincipal, email, téléphone } (nom)}
          <CarteContact titre={nom}>
            <p>{description}</p>
            {#if contacts}
              <div>
                <p>{contacts.introduction}</p>
                <ul>
                  {#each contacts.liens as { libelle, href } (href)}
                    <li><Lien {href} {libelle} blank></Lien></li>
                  {/each}
                </ul>
              </div>
            {/if}
            <LigneContact type="site-web" valeur={lienPrincipal.href} libelle={lienPrincipal.libelle} />
            {#if email}
              <LigneContact type="email" valeur={email} />
            {/if}
            {#if téléphone}
              <LigneContact type="telephone" valeur={téléphone} />
            {/if}
          </CarteContact>
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

  h2,
  p {
    margin: 0;
  }

  h2 {
    margin: 8px 0 0 0;
    font-size: 2rem;
    line-height: 2.5rem;
  }

  p {
    line-height: 1.5rem;
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
