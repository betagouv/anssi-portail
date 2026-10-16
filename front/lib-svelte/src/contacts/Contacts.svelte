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

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Contacts cyber', fondSombre: true };
</script>

<Heros
  description="Des contacts cyber de proximité pour vous orienter et répondre à vos questions."
  format="banniere"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
  theme="clair"
  titre="Contacts cyber"
/>

{#if !$profilStore}
  <FiltresMobile filtreActif={false}>
    <FiltresContacts bind:regionSelectionnee bind:secteurSelectionne />
  </FiltresMobile>
{/if}

<dsfr-container>
  <div class="contenu-section">
    {#if !$profilStore}
      <FiltresBureau filtreActif={false}>
        <FiltresContacts bind:regionSelectionnee bind:secteurSelectionne />
      </FiltresBureau>
    {/if}

    {#if contactsRegionaux || contactSectoriel}
      <div class={['contacts', $profilStore ? 'centre' : '']}>
        <NoteInformation />

        {#if contactsRegionaux}
          <h2>Contacts régionaux</h2>

          {#if contactsRegionaux.COT}
            {@const { nom, email } = contactsRegionaux.COT}
            <div class="carte-contact">
              <h3>
                Délégué(e)s ANSSI de votre {contactsRegionaux.designation}
              </h3>
              <p class="nom">{nom}</p>
              <p class="email">
                <Lien href="mailto:{email}" libelle={email}></Lien>
              </p>
            </div>
          {/if}

          {#if contactsRegionaux.CSIRT}
            {@const { nom, telephone, siteWeb, adresse } = contactsRegionaux.CSIRT}
            <div class="carte-contact">
              <h3>{nom}</h3>
              {#if telephone}
                <p class="telephone">
                  <Lien href="tel:{telephone}" libelle={telephone}></Lien>
                </p>
              {/if}
              <p class="site-web">
                <Lien href={siteWeb} libelle={siteWeb} blank></Lien>
              </p>
              {#if adresse}
                <p class="adresse">{adresse}</p>
              {/if}
            </div>
          {/if}

          {#if contactsRegionaux.campus}
            {@const { nom, siteWeb, adresse, email } = contactsRegionaux.campus}
            <div class="carte-contact">
              <h3>{nom}</h3>
              {#if email}
                <p class="email">
                  <Lien href="mailto:{email}" libelle={email}></Lien>
                </p>
              {/if}
              <p class="site-web">
                <Lien href={siteWeb} libelle={siteWeb} blank></Lien>
              </p>
              <p class="adresse">{adresse}</p>
            </div>
          {/if}
        {/if}

        {#if contactSectoriel}
          <h2>Contacts sectoriels</h2>
          <div class="carte-contact">
            <h3>{contactSectoriel.nom}</h3>
            <p class="site-web">
              <Lien href={contactSectoriel.siteWeb} libelle={contactSectoriel.siteWeb} blank></Lien>
            </p>
          </div>
        {/if}

        <h2>Contacts nationaux</h2>

        {#each contactsInitiaux?.nationaux ?? [] as { nom, description, contacts, lienPrincipal, email, téléphone } (nom)}
          <div class="carte-contact">
            <h3>{nom}</h3>
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
            <p class="site-web">
              <Lien href={lienPrincipal.href} libelle={lienPrincipal.libelle} blank></Lien>
            </p>
            {#if email}
              <p class="email">
                <Lien href="mailto:{email}" libelle={email}></Lien>
              </p>
            {/if}
            {#if téléphone}
              <p class="telephone">
                <Lien href="tel:{téléphone}" libelle={téléphone}></Lien>
              </p>
            {/if}
          </div>
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

  * {
    box-sizing: border-box;
  }

  dsfr-container {
    padding: 48px 0 72px;

    .contenu-section {
      @include a-partir-de(md) {
        display: flex;
        gap: 1.5rem;
      }
    }
  }

  h3,
  h2,
  p {
    margin: 0;
  }

  h2 {
    margin: 8px 0 0 0;
    font-size: 2rem;
    line-height: 2.5rem;

    @include a-partir-de(lg) {
      width: 790px;
    }
  }

  h3 {
    margin-bottom: 8px;
    font-size: 1.25rem;
    line-height: 1.75rem;
  }

  p {
    line-height: 1.5rem;
    display: flex;
    gap: 8px;
    align-items: start;

    &:before {
      width: 16px;
      height: 16px;
      display: block;
      padding: 4px 0 3px 0;
    }

    &.telephone:before {
      content: url('/assets/images/icone-contact-telephone.svg');
    }

    &.email:before {
      content: url('/assets/images/icone-contact-email.svg');
    }

    &.nom:before {
      content: url('/assets/images/icone-contact-nom.svg');
    }

    &.site-web:before {
      content: url('/assets/images/icone-contact-site-web.svg');
    }

    &.adresse:before {
      content: url('/assets/images/icone-contact-adresse.svg');
    }
  }

  .contacts {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 24px;

    &.centre {
      @include a-partir-de(lg) {
        align-items: center;
      }

      > * {
        width: min(100%, 792px);
      }
    }
  }

  .carte-contact {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid var(--border-default-grey);
    border-radius: 8px;
  }

  .aucun-resultat {
    align-items: center;
    display: flex;
    flex: 1;
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
