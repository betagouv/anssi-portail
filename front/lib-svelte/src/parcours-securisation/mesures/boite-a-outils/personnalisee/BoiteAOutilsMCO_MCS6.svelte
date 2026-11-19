<script lang="ts">
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import NoteProcedure from '../NoteProcedure.svelte';
  import OutilModèleInventaireComposantsObsolètes from './outils/OutilModeleInventaireComposantsObsoletes.svelte';
  import OutilRappelMiseÀJourInventaireComposantsObsolètes from './outils/OutilRappelMiseAJourInventaireComposantsObsoletes.svelte';
</script>

<div>
  <h2>Mettez en œuvre des mesures complémentaires pour les logiciels et systèmes obsolètes</h2>
  <NoteProcedure />

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Inventoriez les composants obsolètes">
      <div class="contenu-etape">
        <p class="texte-standard-md">
          Listez les logiciels, systèmes et équipements dont la version n’est plus suivie par son éditeur ou son
          fabricant&nbsp;: postes de travail, serveurs, téléphones, annuaire, équipements industriels. Pour chacun,
          relevez la date de fin de support.
        </p>
        <OutilModèleInventaireComposantsObsolètes />
      </div>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Mettez en place des mesures de compensation pour chaque composant">
      <ul class="texte-standard-md">
        <li>cloisonnement réseau (VLAN dédié, pare-feu avec règles strictes)&#8239;;</li>
        <li>filtrage strict des flux entrants et sortants, limités à l’usage métier&#8239;;</li>
        <li>contrôle d’accès renforcé (comptes dédiés, authentification forte)&#8239;;</li>
        <li>surveillance renforcée (journaux, supervision spécifique)&#8239;;</li>
        <li>secrets d’authentification dédiés, non partagés avec d’autres systèmes.</li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Planifiez le remplacement ou la migration">
      <p class="texte-standard-md">
        Fixez pour chaque composant obsolète une échéance de remplacement, dans une feuille de route de 12 à 24 mois, et
        désignez un responsable.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Tracez la décision">
      <p class="texte-standard-md">
        Notez la justification métier ou technique du maintien, les mesures de compensation appliquées, le responsable
        et la date de réexamen.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Revoyez l’inventaire au moins une fois par an">
      <div class="contenu-etape">
        <p class="texte-standard-md">
          Vérifiez que le maintien de chaque composant reste justifié et que le plan de remplacement avance.
        </p>
        <OutilRappelMiseÀJourInventaireComposantsObsolètes />
      </div>
    </ÉtapeProcédure>
  </ÉtapesProcédure>
</div>

<style lang="scss">
  .contenu-etape {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    p {
      margin: 0;
    }
  }

  ul {
    list-style-type: disc;
    margin: 0;
    padding-left: 1.5rem;

    li + li {
      margin-top: 0.5rem;
    }
  }
</style>
