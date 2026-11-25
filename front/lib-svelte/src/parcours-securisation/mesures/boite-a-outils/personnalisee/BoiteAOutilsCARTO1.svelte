<script lang="ts">
  import Lien from '../../../../ui/Lien.svelte';
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import NoteProcedure from '../NoteProcedure.svelte';
  import OutilModèleCartographie from './outils/OutilModeleCartographie.svelte';
</script>

<div>
  <h2>Formalisez et tenez à jour une cartographie de vos systèmes d’information</h2>
  <NoteProcedure />

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Initiez la démarche">
      <p class="texte-standard-md">
        Définissez le périmètre à cartographier, les personnes à associer et le résultat attendu. Appuyez-vous sur le
        guide ANSSI&nbsp;:<br /> <br /><Lien
          blank
          href="https://messervices.cyber.gouv.fr/documents-guides/20181213_anssi_guide_cartographie_v1b.pdf"
          libelle="Cartographie du système d’information"
        />.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Choisissez un modèle simple en trois vues">
      <p class="texte-standard-md">Trois vues suffisent pour démarrer&nbsp;:</p>
      <ul>
        <li><strong>Vue métier&nbsp;:</strong> vos activités et les applications qui les supportent&#8239;;</li>
        <li><strong>Vue applicative&nbsp;:</strong> vos applications et les flux de données entre elles&#8239;;</li>
        <li><strong>Vue infrastructure&nbsp;:</strong> vos équipements, vos réseaux et leur hébergement.</li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Choisissez vos outils">
      <p class="texte-standard-md">
        Un tableur et un outil de schéma suffisent pour démarrer. Les structures plus avancées peuvent recourir à un
        outil dédié.
      </p>
      <OutilModèleCartographie />
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Construisez la cartographie pas à pas">
      <p class="texte-standard-md">
        Commencez par vos systèmes critiques. Produisez au moins un schéma de réseau simplifié (équipements, zones IP,
        interconnexions) et un inventaire des serveurs et applications critiques.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Pérennisez la cartographie">
      <p class="texte-standard-md">
        Nommez un responsable de la cartographie. Mettez-la à jour à chaque évolution de votre système d’information, et
        conservez une version papier à l’abri de ce système.
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
