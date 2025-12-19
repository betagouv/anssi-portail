<script lang="ts">
  import FiltresBureau from '../ui/FiltresBureau.svelte';
  import FiltresMobile from '../ui/FiltresMobile.svelte';
  import Hero from '../ui/Hero.svelte';
  import { contactsParRegion } from './contacts.donnees';
  import { type Contacts, estCodeRegion } from './contacts.type';
  import FiltresContacts from './FiltresContacts.svelte';

  let contacts: Contacts | undefined = undefined;

  $: if (estCodeRegion(regionSelectionnee)) {
    contacts = contactsParRegion[regionSelectionnee];
  } else {
    contacts = undefined;
  }

  let regionSelectionnee: string = '';
</script>

<Hero
  titre="Contacts cyber"
  description="Des contacts cyber de proximité pour vous orienter et répondre à vos questions."
  ariane="Contacts cyber"
  arianeBranche={{ nom: 'Contacts cyber', lien: '/contacts/' }}
  arianeBrancheConnectee={{ nom: 'Contacts cyber', lien: '/contacts/' }}
></Hero>

<FiltresMobile filtreActif={false}>
  <FiltresContacts bind:regionSelectionnee/>
</FiltresMobile>

<section>
  <div class="contenu-section">
    <FiltresBureau filtreActif={false}>
      <FiltresContacts bind:regionSelectionnee/>
    </FiltresBureau>

    {#if contacts}
      <div class="contacts">
        <h2>Contacts régionaux</h2>

        {#if contacts.COT}
          {@const { nom, email } = contacts.COT}
          <div class="carte-contact">
            <h3>Délégué(e)s ANSSI de votre région</h3>
            <p class="nom">{nom}</p>
            <p class="email"><a href="mailto:{email}">{email}</a></p>
          </div>
        {/if}

        {#if contacts.CSIRT}
          {@const { nom, telephone, siteWeb, adresse } = contacts.CSIRT}
          <div class="carte-contact">
            <h3>{nom}</h3>
            {#if telephone}
              <p class="telephone"><a href="tel:{telephone}">{telephone}</a></p>
            {/if}
            <p class="site-web">
              <a href={siteWeb} target="_blank">{siteWeb}</a>
            </p>
            {#if adresse}
              <p class="adresse">{adresse}</p>
            {/if}
          </div>
        {/if}

        {#if contacts.campus}
          {@const { nom, siteWeb, adresse, email } = contacts.campus}
          <div class="carte-contact">
            <h3>{nom}</h3>
            {#if email}
              <p class="email"><a href="mailto:{email}">{email}</a></p>
            {/if}
            <p class="site-web">
              <a href={siteWeb} target="_blank">{siteWeb}</a>
            </p>
            <p class="adresse">{adresse}</p>
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
                  >Déclarer un incident et/ou demander une assistance</a
                >
              </li>
              <li>
                <a
                  href="https://club.ssi.gouv.fr/#/declaration-art-2321-4-1"
                  target="_blank">Signaler une vulnérabilité produit</a
                >
              </li>
            </ul>
            <a href="https://www.cert.ssi.gouv.fr/contact/" target="_blank"
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
              >Aller sur le 17Cyber
            </a>
          </div>
        </div>
      </div>
    {:else}
      <div class="aucun-resultat">
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
      display: flex;
      gap: 1.5rem;
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

    @include a-partir-de(lg) {
      align-items: center;
    }
  }

  .carte-contact {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid #ddd;
    border-radius: 8px;
    @include a-partir-de(lg) {
      width: 792px;
    }
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
