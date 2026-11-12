<script lang="ts">
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import OutilModèleRACI from './outils/OutilModeleRaci.svelte';
</script>

<div>
  <h2>Organisation de la sécurité numérique</h2>

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Désignez un référent en sécurité">
      <p class="texte-standard-md">
        Dans une PME, ce peut être le responsable informatique ou un prestataire externe missionné.
      </p>
      <p class="texte-standard-md">
        Dans une plus grande structure, ce peut être un responsable de la sécurité des systèmes d’information (RSSI) à
        temps plein ou partiel.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Formalisez un RACI simple sur les principales activités">
      <p class="texte-standard-md">
        Concernez au minimum les sauvegardes, la gestion des incidents, la sensibilisation, le contrôle d’accès et la
        revue de conformité. Pour chaque activité, indiquez qui est Responsable, qui Approuve, qui est Consulté et qui
        est Informé.
      </p>
      <p class="texte-detail-sm explication">
        Pour vous aider à démarrer, notre modèle propose ces activités en colonnes, les acteurs en lignes, des listes
        déroulantes et un exemple déjà rempli. Vous pouvez ajouter vos propres activités et acteurs&nbsp;:
      </p>
      <OutilModèleRACI />
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Mettez en place une comitologie">
      <p class="texte-standard-md">
        Organisez un comité de pilotage de la sécurité, régulier, qui réunit la direction, le référent et un
        représentant des métiers.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Communiquez le nom du référent">
      <p class="texte-standard-md">
        Communiquez à tous les collaborateurs le nom du référent et le canal pour le contacter.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Inscrivez le rôle dans une fiche de poste">
      <p class="texte-standard-md">
        Inscrivez le rôle dans la fiche de poste du référent et prévoyez une formation adaptée.
      </p>
    </ÉtapeProcédure>
  </ÉtapesProcédure>
</div>

<style lang="scss">
  .explication {
    font-style: italic;
  }
</style>
