<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import Accordeon from '../ui/Accordeon.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';
  import Lien from '../ui/Lien.svelte';
  import SectionWebCAccordeon from './SectionWebCAccordeon.svelte';

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Intégrer nos dispositifs' };
</script>

<Heros
  description="Enrichissez votre site avec des outils et services cyber gratuits, simples à intégrer et accessibles à tous."
  format="banniere"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
  theme="clair"
  titre="Intégrer nos dispositifs"
/>

<dsfr-container>
  <div class="accordeons">
    <Accordeon libelle="Test • Quelle est la maturité cyber de votre organisation&nbsp;?">
      <SectionWebCAccordeon
        fichierPhp="mini-test-maturite.php"
        lienDémo="https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/demo/mini-test-maturite.php"
        lienProd="https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/prod/mini-test-maturite.php"
      />
    </Accordeon>
    <Accordeon libelle="Test • Cyber&ZeroWidthSpace;attaques&nbsp;: saurez-vous démêler le vrai du faux&nbsp;?">
      <SectionWebCAccordeon
        fichierPhp="mini-test-vrai-faux.php"
        lienDémo="https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/demo/mini-test-vrai-faux.php"
        lienProd="https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/prod/mini-test-vrai-faux.php"
      />
    </Accordeon>
    <Accordeon libelle="Test • Quels types de cyber&ZeroWidthSpace;attaques peuvent cibler mon organisation&nbsp;?">
      <SectionWebCAccordeon
        fichierPhp="mini-test-expostion.php"
        lienDémo="https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/demo/ini-test-expostion.php"
        lienProd="https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.0.0/prod/ini-test-expostion.php"
      />
    </Accordeon>
    <Accordeon libelle="Demande de diagnostic cyber&nbsp;?">
      <SectionWebCAccordeon
        fichierPhp="demande-diag.php"
        lienDémo="https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.1.2/demo/demande-diag.php"
        lienProd="https://messervicescyber-web-components.cellar-c2.services.clever-cloud.com/1.1.2/prod/demande-diag.php"
      />
    </Accordeon>
  </div>
  <div class="contactez-nous">
    <p>Vous rencontrez des difficultés&nbsp;?&nbsp;</p>
    <Lien href="https://aide.messervices.cyber.gouv.fr/fr/?chat=ouvert" libelle="contactez-nous" />
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;
  dsfr-container {
    display: flex;
    flex-direction: column;
    padding: 3rem 0;

    .accordeons {
      margin-inline: auto;
      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(8);
      }
    }

    .contactez-nous {
      display: flex;
      flex-wrap: wrap;
      margin-inline: auto;
      margin-top: 2.5rem;

      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(8);
      }
      p {
        margin: 0;
      }
    }
  }
</style>
