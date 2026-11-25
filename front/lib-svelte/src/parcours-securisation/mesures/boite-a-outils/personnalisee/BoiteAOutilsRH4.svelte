<script lang="ts">
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import NoteProcedure from '../NoteProcedure.svelte';
  import OutilModeleSuiviDeChangementDeFonction from './outils/OutilModeleSuiviDeChangementDeFonction.svelte';
  import OutilModeleSuiviDesArrivees from './outils/OutilModeleSuiviDesArrivees.svelte';
  import OutilModeleSuiviDesDeparts from './outils/OutilModeleSuiviDesDeparts.svelte';
</script>

<div>
  <h2>Processus arrivées / départs / mobilités</h2>
  <NoteProcedure />

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Une personne rejoint votre organisation">
      <div class="contenu-etape">
        <ul class="texte-standard-md">
          <li>création du compte nominatif (utilisateur standard)&#8239;;</li>
          <li>attribution des accès strictement nécessaires aux missions&#8239;;</li>
          <li>remise du matériel (PC, smartphone) avec configuration verrouillée&#8239;;</li>
          <li>remise et signature de la charte d’usage&#8239;;</li>
          <li>séance d’accueil sécurité (rappel des bonnes pratiques).</li>
        </ul>
        <OutilModeleSuiviDesArrivees />
      </div>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Une personne change de fonction">
      <div class="contenu-etape">
        <ul class="texte-standard-md">
          <li>revue des accès et droits&#8239;;</li>
          <li>retrait des accès devenus inutiles&#8239;;</li>
          <li>attribution des nouveaux accès nécessaires&#8239;;</li>
          <li>mise à jour des annuaires internes.</li>
        </ul>
        <OutilModeleSuiviDeChangementDeFonction />
      </div>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Une personne quitte votre organisation">
      <div class="contenu-etape">
        <ul class="texte-standard-md">
          <li>retrait des accès physiques (badge, clés)&#8239;;</li>
          <li>récupération du matériel&#8239;;</li>
          <li>changement des mots de passe partagés que l’utilisateur connaissait&#8239;;</li>
          <li>transfert des données professionnelles utiles à l’équipe&#8239;;</li>
          <li>mise en redirection ou clôture de la boîte mail selon la politique en vigueur.</li>
        </ul>
        <OutilModeleSuiviDesDeparts />
      </div>
    </ÉtapeProcédure>
  </ÉtapesProcédure>
</div>

<style lang="scss">
  .contenu-etape {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    ul {
      margin: 0;
    }
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;

    li + li {
      margin-top: 0.5rem;
    }
  }
</style>
