<script lang="ts">
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import OutilModèleRevueComptesUtilisateurs from './outils/OutilModeleRevueComptesUtilisateurs.svelte';
</script>

<div>
  <h2>Établissez votre annuaire de crise à imprimer</h2>
  <p class="texte-mention-xs">
    Cette démarche est proposée à titre indicatif. Vous êtes libre de l’adapter à votre contexte et de mobiliser les
    outils et méthodes de votre choix.
  </p>

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Répertoriez les comptes existants.">
      <p class="texte-standard-md avec-outil">
        Exportez la liste des comptes utilisateurs de vos différents systèmes&nbsp;: annuaire d’entreprise, applications
        métiers, systèmes critiques, etc.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Vérifiez chaque compte.">
      <p class="texte-standard-md">Pour chaque compte, vérifier&nbsp;:</p>
      <ul>
        <li>l’existence d'un utilisateur ou d'un processus rattaché&nbsp;;</li>
        <li>le rattachement nominatif (sauf comptes de service justifiés)&nbsp;;</li>
        <li>la dernière connexion (les comptes inactifs depuis longtemps doivent être désactivés)&nbsp;;</li>
        <li>le statut RH (toujours en poste ou parti)&nbsp;;</li>
        <li>la cohérence avec la mission actuelle.</li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Faites valider les comptes par les responsables métiers.">
      <p class="texte-standard-md">Demandez-leur de confirmer que les comptes sont toujours nécessaires.</p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Désactiver / supprimer les comptes inutiles ou non justifiés.">
      <p class="texte-standard-md">
        Supprimez les comptes qui ne sont plus nécessaires et désactivez ceux qui sont inactifs ou dont l'utilité doit
        être vérifiée.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Conservez une trace de votre revue.">
      <p class="texte-standard-md">
        Garder une trace de votre travail. date, périmètre, participants, anomalies relevées, actions correctives.
      </p>
      <p class="texte-detail-sm explication">Pour vous aider, utilisez notre modèle de compte rendu prêt à remplir.</p>
      <OutilModèleRevueComptesUtilisateurs />
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
