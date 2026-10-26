<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import Accordeon from '../ui/Accordeon.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';
  import Lien from '../ui/Lien.svelte';

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
    <Accordeon libelle="Test • Quelle est la maturité cyber de votre organisation&nbsp;?"></Accordeon>
    <Accordeon libelle="Test • Cyber&ZeroWidthSpace;attaques&nbsp;: saurez-vous démêler le vrai du faux&nbsp;?"
    ></Accordeon>
    <Accordeon libelle="Test • Quels types de cyber&ZeroWidthSpace;attaques peuvent cibler mon organisation&nbsp;?"
    ></Accordeon>
    <Accordeon libelle="Test • Comment réagirez-vous en cas de cyber&ZeroWidthSpace;attaque&nbsp;?"></Accordeon>
    <Accordeon libelle="Demande de diagnostic cyber&nbsp;?"></Accordeon>
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
