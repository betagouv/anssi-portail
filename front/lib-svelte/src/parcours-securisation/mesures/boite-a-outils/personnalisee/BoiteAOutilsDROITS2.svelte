<script lang="ts">
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import NoteProcedure from '../NoteProcedure.svelte';
  import OutilModèleRevueDroitsDAccès from './outils/OutilModeleRevueDroitsDAcces.svelte';
</script>

<div>
  <h2>Revue annuelle des droits</h2>
  <NoteProcedure />

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Répertoriez les droits d'accès existants.">
      <p class="texte-standard-md">
        Pour chaque application ou équipement, exportez la liste des utilisateurs et des droits qui leur sont attribués.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Faites vérifier les droits par les responsables concernés.">
      <p class="texte-standard-md">Transmettez la liste au responsable de chaque ressource, pour validation&nbsp;:</p>
      <ul>
        <li>cet utilisateur a-t-il toujours besoin de ce droit&#8239;?</li>
        <li>le niveau de droit est-il adapté&#8239;?</li>
        <li>faut-il retirer / ajouter quelque chose&#8239;?</li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Mettez à jour les droits d'accès.">
      <p class="texte-standard-md">Appliquez les modifications validées par les responsables concernés.</p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Conservez une trace de votre revue.">
      <p class="texte-standard-md">
        Notez la date, les applications et équipements vérifiés, les personnes ayant validé les droits et les
        modifications effectuées.
      </p>
      <p class="texte-detail-sm explication">Pour vous aider, utilisez notre modèle de compte rendu prêt à remplir.</p>
      <OutilModèleRevueDroitsDAccès />
    </ÉtapeProcédure>
  </ÉtapesProcédure>
</div>

<style lang="scss">
  .explication {
    font-style: italic;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
  }
</style>
