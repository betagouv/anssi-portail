<script lang="ts">
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import OutilModèleDActivités from './outils/OutilModeleDActivites.svelte';
  import OutilRappelMiseÀJourActivités from './outils/OutilRappelMiseAJourActivites.svelte';
</script>

<div>
  <h2>Listez les activités et systèmes à protéger en priorité</h2>
  <p class="texte-mention-xs">
    Cette démarche est proposée à titre indicatif. Vous êtes libre de l’adapter à votre contexte et de mobiliser les
    outils et méthodes de votre choix.
  </p>

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Lister toutes les activités de l'organisation, sans en écarter d'emblée">
      <p class="texte-standard-md avec-outil">
        Partir des grandes fonctions (production, R&D, commercial, paie, comptabilité, communication…) et détailler
        chacune, y compris celles qui ne sont soumises à aucune obligation réglementaire.
      </p>
      <p class="texte-detail-sm explication">
        Pour vous aider à démarrer, notre modèle propose des exemples d'activités courantes et les colonnes déjà prêtes
        à compléter&nbsp;:
      </p>
      <OutilModèleDActivités />
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Évaluez l'impact d'un incident sur chaque activité">
      <p class="texte-standard-md">
        Pour chaque activité, sélectionner celles à protéger en priorité en se posant la question de l'impact d'un
        incident&nbsp;:
      </p>
      <ul>
        <li>
          un arrêt de cette activité perturberait-il fortement, voire stopperait-il, l'organisation (impact sur la
          disponibilité)&nbsp;?
        </li>
        <li>
          un incident sur cette activité entraînerait-il une perte, une fuite ou une altération de données sensibles
          (clients, techniques, bancaires)&nbsp;?
        </li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Marquez les activités prioritaires">
      <p class="texte-standard-md">
        Marquer comme « prioritaires » les activités qui répondent Oui à au moins une de ces questions.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Identifiez les systèmes qui supportent ces activités">
      <p class="texte-standard-md">
        Pour chaque activité prioritaire, identifier les systèmes d'information qui la supportent&nbsp;: logiciels,
        applications, serveurs, équipements, services numériques et prestataires nécessaires à son fonctionnement.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Consolidez le tout dans un tableau de synthèse">
      <p class="texte-standard-md">
        Consolider le tout dans un tableur d'une page pour conserver la trace et pouvoir la relire lors de la prochaine
        revue.
      </p>
      <p class="texte-detail-sm explication">
        Vous pouvez ajouter directement à votre propre agenda un rappel dans un an pour vérifier que le fichier est
        toujours à jour&nbsp;:
      </p>
      <OutilRappelMiseÀJourActivités />
    </ÉtapeProcédure>
  </ÉtapesProcédure>
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
</style>
