<script lang="ts">
  import Hero from '../ui/Hero.svelte';
  import { contactsParRegion } from './contacts.donnees';
  import { estCodeRegion, type Contacts } from './contacts.type';

  let contacts: Contacts | undefined = undefined;

  const [codeRegionExtrait] = window.location.pathname.split('/').slice(-1);
  const codeRegion = codeRegionExtrait.toUpperCase();
  if (estCodeRegion(codeRegion)) {
    contacts = contactsParRegion[codeRegion];
  }
</script>

<Hero
  titre="Contacts utiles"
  description="Des contacts cyber utiles de proximité pour vous orienter."
  ariane="Contacts utiles"
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
