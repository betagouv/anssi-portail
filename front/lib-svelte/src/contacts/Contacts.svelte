<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { Branche } from '../ui/filAriane';
  import Hero from '../ui/Hero.svelte';
  import { contactsParRegion } from './contacts.donnees';
  import {
    estCodeRegion,
    type CodeRegion,
    type Contacts,
  } from './contacts.type';

  type Region = { nom: string; codeIso: CodeRegion };

  let contacts: Contacts | undefined = undefined;
  let nomDeLaRegion: string | undefined;
  let branche: Branche | undefined;
  let description: string =
    'Des contacts cyber de proximité pour vous orienter et répondre à vos questions.';
  let nomParRegion: Region[] = [];

  const [codeRegionExtrait] = window.location.pathname.split('/').slice(-1);
  const codeRegion = codeRegionExtrait.toUpperCase();
  if (estCodeRegion(codeRegion)) {
    contacts = contactsParRegion[codeRegion];
    description = '';
    branche = {
      nom: 'Contacts cyber',
      lien: '/contacts/',
    };
  }

  onMount(async () => {
    const reponse = await axios.get<Region[]>('/api/annuaire/regions');
    nomParRegion = reponse.data;
    if (estCodeRegion(codeRegion)) {
      nomDeLaRegion = nomParRegion.find(
        (region) => region.codeIso === codeRegion
      )?.nom;
    }
  });
</script>

<Hero
  titre={nomDeLaRegion ?? 'Contacts cyber'}
  {description}
  ariane={nomDeLaRegion ?? 'Contacts cyber'}
  arianeBranche={branche}
  arianeBrancheConnectee={branche}
></Hero>

<section>
  <div class="contenu-section">
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
      <h4>Sélectionnez une région</h4>
      <ul class="regions">
        {#each nomParRegion.sort( (a, b) => a.nom.localeCompare(b.nom) ) as { nom, codeIso } (codeIso)}
          <li>
            <lab-anssi-icone nom="arrow-right-line"></lab-anssi-icone>
            <lab-anssi-lien
              href="/contacts/{codeIso}"
              apparence="lien"
              variante="primaire"
              taille="md"
              titre={nom}
            ></lab-anssi-lien>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive.scss' as *;

  * {
    box-sizing: border-box;
  }

  section {
    padding: 48px var(--gouttiere) 72px;

    .contenu-section {
      max-width: 996px;
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

  h4 {
    color: #161616;
    font-size: 1.375rem;
    font-weight: bold;
    line-height: 1.75rem;
    margin: 0;
    margin-bottom: 2rem;

    @include a-partir-de(lg) {
      font-size: 1.5rem;
      line-height: 2rem;
    }
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

  .regions {
    padding: 0;
    display: grid;
    grid-template-rows: 1fr;
    gap: 1rem;

    @include a-partir-de(md) {
      grid-auto-flow: column;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(10, 1fr);
    }

    li {
      display: flex;
      gap: 4px;
    }
  }
</style>
