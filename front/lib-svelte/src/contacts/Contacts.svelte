<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import type { Contacts } from './contacts';
  import Hero from '../Hero.svelte';

  let contacts: Contacts;

  onMount(async () => {
    const reponseContacts = await axios.get<Contacts>('/api/contacts');
    contacts = reponseContacts.data;
  });
</script>

<Hero
  titre="Vos contacts"
  description="Des contacts cyber utiles de proximité pour vous orienter."
  ariane="Vos contacts"
></Hero>

<section>
  <div class="contenu-section">
    {#if contacts}
      <div class="contacts">
        {#if contacts.COT}
          {@const { nom, email } = contacts.COT}
          <div class="carte-contact">
            <h2>Délégué(e)s ANSSI de votre région</h2>
            <p class="nom">{nom}</p>
            <p class="email"><a href="mailto:{email}">{email}</a></p>
          </div>
        {/if}

        {#if contacts.CSIRT}
          {@const { nom, telephone, siteWeb, adresse } = contacts.CSIRT}
          <div class="carte-contact">
            <h2>{nom}</h2>
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
            <h2>{nom}</h2>
            {#if email}
              <p class="email"><a href="mailto:{email}">{email}</a></p>
            {/if}
            <p class="site-web">
              <a href={siteWeb} target="_blank">{siteWeb}</a>
            </p>
            <p class="adresse">{adresse}</p>
          </div>
        {/if}

        <div class="carte-contact">
          <h2>CERT-FR</h2>
          <ul class="telephone">
            <li>
              Depuis la France métropolitaine au <a href="tel:3218">3218</a>
              (service gratuit + prix d’un appel) ou
              <a href="tel:09 70 83 32 18">09 70 83 32 18</a>
            </li>
            <li>
              Depuis certaines collectivités territoriales situées en Outre-mer
              ou depuis l’étranger au <a href="tel:+33 9 70 83 32 18"
                >+33 9 70 83 32 18</a
              >
            </li>
          </ul>
          <p class="email">
            <a href="mailto:cert-fr@ssi.gouv.fr">cert-fr@ssi.gouv.fr</a>
          </p>
          <p class="site-web">
            <a href="https://www.cert.ssi.gouv.fr" target="_blank"
              >https://www.cert.ssi.gouv.fr</a
            >
          </p>
        </div>
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive.scss' as *;

  h2,
  p {
    margin: 0;
  }

  h2 {
    margin-bottom: 8px;
    font-size: 20px;
    line-height: 28px;
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
    padding: 32px 16px;
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
      width: 726px;
    }
  }
</style>
