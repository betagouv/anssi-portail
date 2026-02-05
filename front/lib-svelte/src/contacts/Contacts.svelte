<script lang="ts">
  import { onMount } from 'svelte';
  import { creeLeFragmentDeNavigation } from '../catalogue/fragmentDeNavigation';
  import { profilStore } from '../stores/profil.store';
  import FiltresBureau from '../ui/FiltresBureau.svelte';
  import FiltresMobile from '../ui/FiltresMobile.svelte';
  import Hero from '../ui/Hero.svelte';
  import { estCodeSecteurContact } from './contacts';
  import { contactsParRegion, contactsParSecteur } from './contacts.donnees';
  import { estCodeRegion } from './contacts.type';
  import FiltresContacts from './FiltresContacts.svelte';
  import NoteInformation from './NoteInformation.svelte';

  let regionSelectionnee: string = $state('');
  let secteurSelectionne: string = $state('');

  const contactsRegionaux = $derived(
    estCodeRegion(regionSelectionnee)
      ? contactsParRegion[regionSelectionnee]
      : undefined
  );

  const contactSectoriel = $derived(
    estCodeSecteurContact(secteurSelectionne)
      ? contactsParSecteur[secteurSelectionne]
      : undefined
  );

  // Gestion du fragment
  let fragmentDeNavigation = $state(
    creeLeFragmentDeNavigation(window.location.hash)
  );
  const changeLeFragmentDeNavigation = () => {
    fragmentDeNavigation = creeLeFragmentDeNavigation(window.location.hash);
    appliqueLesFiltres();
  };
  $effect(() => {
    window.addEventListener('hashchange', changeLeFragmentDeNavigation);
    return () => {
      window.removeEventListener('hashchange', changeLeFragmentDeNavigation);
    };
  });

  // Gestion des filtres
  const appliqueLesFiltres = () => {
    const parametreRegion = fragmentDeNavigation.extraisValeur('region', '');
    regionSelectionnee = estCodeRegion(parametreRegion) ? parametreRegion : '';
    const parametreSecteur = fragmentDeNavigation.extraisValeur('secteur', '');
    secteurSelectionne = estCodeSecteurContact(parametreSecteur)
      ? parametreSecteur
      : '';
  };
  appliqueLesFiltres();
  $effect(() => {
    fragmentDeNavigation.change('region', regionSelectionnee);
    fragmentDeNavigation.change('secteur', secteurSelectionne);
    window.location.hash = fragmentDeNavigation.serialise();
  });

  onMount(() => {
    const [codeRegionExtrait] = window.location.pathname.split('/').slice(-1);
    const codeRegion = codeRegionExtrait.toUpperCase();
    if (estCodeRegion(codeRegion)) {
      history.replaceState({}, '', '/contacts/');
      window.location.hash = `#?region=${codeRegion}`;
    }
  });
</script>

<Hero
  titre="Contacts cyber"
  description="Des contacts cyber de proximité pour vous orienter et répondre à vos questions."
  ariane="Contacts cyber"
  arianeBranche={undefined}
  arianeBrancheConnectee={undefined}
></Hero>

{#if !$profilStore}
  <FiltresMobile filtreActif={false}>
    <FiltresContacts bind:regionSelectionnee bind:secteurSelectionne />
  </FiltresMobile>
{/if}

<section>
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
                <a href="mailto:{email}" class="lien">{email}</a>
              </p>
            </div>
          {/if}

          {#if contactsRegionaux.CSIRT}
            {@const { nom, telephone, siteWeb, adresse } =
              contactsRegionaux.CSIRT}
            <div class="carte-contact">
              <h3>{nom}</h3>
              {#if telephone}
                <p class="telephone">
                  <a href="tel:{telephone}" class="lien">{telephone}</a>
                </p>
              {/if}
              <p class="site-web">
                <a href={siteWeb} target="_blank" class="lien">{siteWeb}</a>
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
                  <a href="mailto:{email}" class="lien">{email}</a>
                </p>
              {/if}
              <p class="site-web">
                <a href={siteWeb} target="_blank" class="lien">{siteWeb}</a>
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
              <a href={contactSectoriel.siteWeb} target="_blank" class="lien"
                >{contactSectoriel.siteWeb}</a
              >
            </p>
          </div>
        {/if}

        <h2>Contacts nationaux</h2>

        <div class="carte-contact">
          <h3>CERT-FR</h3>
          <div>
            <p>
              Le CERT-FR est l'interlocuteur de référence des entités publiques
              et régulées (opérateurs d'importance vitale, opérateurs de
              services essentiels).
            </p>
            <br />
            <p>Contactez le CERT-FR pour :</p>
            <ul>
              <li>
                <a
                  href="https://club.ssi.gouv.fr/#/declaration-incident"
                  target="_blank"
                  class="lien"
                  >Déclarer un incident et/ou demander une assistance</a
                >
              </li>
              <li>
                <a
                  href="https://club.ssi.gouv.fr/#/declaration-art-2321-4-1"
                  class="lien"
                  target="_blank">Signaler une vulnérabilité produit</a
                >
              </li>
            </ul>
            <a
              href="https://www.cert.ssi.gouv.fr/contact/"
              target="_blank"
              class="lien"
              >Toutes les coordonnées du CERT-FR
            </a>
          </div>
        </div>

        <div class="carte-contact">
          <h3>17 Cyber</h3>
          <div>
            <p>
              Le 17cyber propose aux particuliers et aux autres entités, un
              diagnostic permettant d'obtenir des recommandations en cas
              d'incident et d'être mis en relation avec un policier, un
              gendarme, un prestataire ou un CSIRT territorial .
            </p>
            <br />
            <a
              href="https://www.cybermalveillance.gouv.fr/diagnostic"
              target="_blank"
              class="lien"
              >Aller sur le 17Cyber
            </a>
          </div>
        </div>
      </div>
    {:else}
      <div class="aucun-resultat">
        <NoteInformation />
        <img
          src="/assets/images/contacts-resultat-vide.svg"
          alt="Aucun résultat"
        />
        <h5>
          Sélectionnez une région ou un secteur d’activité depuis le menu de
          filtres.
        </h5>
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  * {
    box-sizing: border-box;
  }

  section {
    padding: 48px var(--gouttiere) 72px;

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
    line-height: 24px;
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
