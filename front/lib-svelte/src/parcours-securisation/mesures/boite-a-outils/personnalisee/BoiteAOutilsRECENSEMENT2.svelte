<script lang="ts">
  import Lien from '../../../../ui/Lien.svelte';
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
</script>

<div>
  <h2>Identifier les systèmes non exposés aux risques</h2>
  <p class="texte-mention-xs">
    Cette démarche est proposée à titre indicatif. Vous êtes libre de l’adapter à votre contexte et de mobiliser les
    outils et méthodes de votre choix.
  </p>

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Faites évoluer votre liste d’activités et de systèmes.">
      <ul>
        <li>
          Ouvrez le tableau réalisé lors de la mesure «&nbsp;<Lien
            href="/mesures/RECENSEMENT.1"
            libelle="Lister les activités et les systèmes à protéger"
          />&nbsp;».
        </li>
        <li>
          Ajoutez 4 nouvelles colonnes&nbsp;:
          <ul>
            <li>D (Disponibilité)</li>
            <li>I (Intégrité)</li>
            <li>C (Confidentialité)</li>
            <li>Justifications</li>
          </ul>
        </li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Évaluez la criticité de chaque système.">
      <p class="texte-standard-md">
        Pour chaque système, remplissez les colonnes D (Disponibilité), I (Intégrité) et C (Confidentialité)&nbsp;:
      </p>
      <ul>
        <li>
          <b>D (Disponibilité)&nbsp;:</b> Si ce système ne fonctionne plus, mon activité est-elle perturbée ou interrompue&nbsp;?
          (Oui ou non)
        </li>
        <li>
          <b>I (Intégrité)&nbsp;:</b> Si ses informations sont modifiées à mon insu, cela peut-il avoir des conséquences sur
          mon activité&nbsp;? (Oui ou non)
        </li>
        <li>
          <b>C (Confidentialité)&nbsp;:</b> Si ses informations sont divulguées, cela peut-il poser un problème (données personnelles,
          secret commercial, etc.)&nbsp;? (Oui ou non)
        </li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Identifiez les systèmes non critiques.">
      <p class="texte-standard-md">
        Repérez les systèmes pour lesquels vous avez répondu «&nbsp;Non&nbsp;» aux trois questions et indiquez
        «&nbsp;Non exposé&nbsp;» dans votre tableau.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Justifiez votre évaluation.">
      <p class="texte-standard-md">
        Dans la colonne «&nbsp;Justification&nbsp;», expliquez brièvement les raisons de votre choix. Cela vous
        permettra de retrouver et de réévaluer vos décisions lors d’une prochaine revue.
      </p>
    </ÉtapeProcédure>
  </ÉtapesProcédure>

  <div class="bloc-complementaire">
    <h5 class="fr-h6 petit-titre">Mesure associée</h5>
    <Lien
      href="/mesures/RECENSEMENT.3"
      libelle="Réexaminer la liste des activités et systèmes à protéger a minima annuellement et en tant que de besoin"
    />
  </div>
</div>

<style lang="scss">
  .texte-mention-xs {
    font-style: italic;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;

    ul {
      list-style-type: circle;
    }
  }

  .bloc-complementaire {
    margin-bottom: 1.5rem;
  }

  .petit-titre {
    margin-bottom: 1rem;
  }
</style>
