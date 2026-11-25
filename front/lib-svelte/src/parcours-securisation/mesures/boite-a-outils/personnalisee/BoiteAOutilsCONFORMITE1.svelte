<script lang="ts">
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import NoteProcedure from '../NoteProcedure.svelte';
  import OutilModèleAnalyseDeConformité from './outils/OutilModeleAnalyseDeConformite.svelte';
</script>

<div>
  <h2>Réalisez une analyse de conformité pour chaque système d’information</h2>
  <NoteProcedure />

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Lister les exigences réglementaires">
      <p class="texte-standard-md">
        Identifiez les exigences réglementaires applicables à votre entité selon le statut important ou essentiel de
        l’entité.
      </p>
      <OutilModèleAnalyseDeConformité />
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Remplissez le fichier d’analyse de conformité">
      <p class="texte-standard-md">Pour chaque système d’information identifié, complétez le tableau&nbsp;:</p>
      <ul>
        <li><strong>Exigence&nbsp;:</strong> son libellé&#8239;;</li>
        <li><strong>Statut&nbsp;:</strong> Appliqué, Partiel ou Non appliqué&#8239;;</li>
        <li><strong>Preuve&nbsp;:</strong> la preuve ou la référence à la mesure interne&#8239;;</li>
        <li><strong>Justification&nbsp;:</strong> l’explication en cas d’écart ou de mesure alternative.</li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Faites valider l’analyse">
      <p class="texte-standard-md">
        Faites-la relire et approuver par la direction (comité de direction) ou par le référent SSI.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Conserver les preuves">
      <p class="texte-standard-md">
        Gardez la politique appliquée, les procédures et les captures de configuration. L’analyse alimente ensuite le
        plan d’action de correction des écarts avec le référentiel Recyf.
      </p>
    </ÉtapeProcédure>
  </ÉtapesProcédure>
</div>

<style lang="scss">
  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
  }
</style>
