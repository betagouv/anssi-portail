<script lang="ts">
  import Lien from '../../../../ui/Lien.svelte';
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import OutilRappelMiseÀJourActivités from './outils/OutilRappelMiseAJourActivites.svelte';
</script>

<div>
  <h2>Réexaminer la liste des activités et systèmes</h2>
  <p class="texte-mention-xs">
    Cette démarche est proposée à titre indicatif. Vous êtes libre de l’adapter à votre contexte et de mobiliser les
    outils et méthodes de votre choix.
  </p>

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Organisez une revue annuelle.">
      <p class="texte-standard-md">
        Fixer une date récurrente et réunissez les personnes concernées&nbsp;: le dirigeant (ou son délégué), le
        responsable IT (interne ou prestataire) et les responsables métiers concernés.
      </p>
      <p class="texte-detail-sm explication">
        Vous pouvez ajouter directement à votre propre agenda un rappel dans un an pour vérifier que le fichier est
        toujours à jour&nbsp;:
      </p>
      <OutilRappelMiseÀJourActivités />
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Réexaminez votre liste d'activités et de systèmes">
      <p class="texte-standard-md">
        Reprenez la liste établie lors des mesures «&nbsp;Lister les activités et les systèmes à protéger&nbsp;» et
        «&nbsp;Identifier les systèmes non exposés aux risques&nbsp;».
      </p>
      <p class="texte-standard-md">Pour chaque élément, posez-vous les quatre questions suivantes&nbsp;:</p>
      <ul>
        <li>Faut-il étendre le périmètre (nouveaux systèmes apparus dans l'année)&nbsp;?</li>
        <li>Faut-il revoir l'exposition du système aux risques&nbsp;?</li>
        <li>Faut-il affiner certaines parties (responsables, fournisseurs, dépendances)&nbsp;?</li>
        <li>Quels sont les délais pour les prochaines évolutions identifiées&nbsp;?</li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Mise à jour événementielle.">
      <p class="texte-standard-md">Mettez à jour la liste sans attendre la revue dès qu'un événement survient&nbsp;:</p>
      <ul>
        <li>mise en service ou arrêt d'un système&nbsp;;</li>
        <li>changement de prestataire, d'hébergeur ou d'éditeur&nbsp;;</li>
        <li>évolution majeure de l'activité (nouveau site, nouvelle gamme, fusion-acquisition)&nbsp;;</li>
        <li>incident ayant révélé une lacune dans la liste.</li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Conservez une trace de chaque révision.">
      <p class="texte-standard-md">
        Pour chaque revue, noter la date, les participants, les modifications apportées et la prochaine échéance.
      </p>
    </ÉtapeProcédure>
  </ÉtapesProcédure>

  <div class="bloc-complementaire">
    <h5 class="fr-h6 petit-titre">Pour aller plus loin</h5>
    <Lien
      blank
      href="https://messervices.cyber.gouv.fr/documents-guides/20181213_anssi_guide_cartographie_v1b.pdf"
      libelle="Guide ANSSI «&nbsp;Cartographie du système d'information – Guide d'élaboration en 5 étapes&nbsp;», Étape 5"
    />
  </div>

  <div class="bloc-complementaire">
    <h5 class="fr-h6 petit-titre">Mesures associées</h5>
    <ul>
      <li>
        <Lien href="/mesures/RECENSEMENT.1" libelle="Lister les activités et les systèmes à protéger" />
      </li>
      <li>
        <Lien
          href="/mesures/RECENSEMENT.2"
          libelle="Identifier au sein de la liste des activités et systèmes les systèmes"
        />
      </li>
    </ul>
  </div>
</div>

<style lang="scss">
  .texte-mention-xs,
  .explication {
    font-style: italic;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
  }

  .bloc-complementaire {
    margin-bottom: 1.5rem;
  }

  .petit-titre {
    margin-bottom: 1rem;
  }
</style>
