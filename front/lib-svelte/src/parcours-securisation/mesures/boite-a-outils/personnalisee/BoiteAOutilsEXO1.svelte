<script lang="ts">
  import Lien from '../../../../ui/Lien.svelte';
  import EtapeProcedure from '../EtapeProcedure.svelte';
  import EtapesProcedure from '../EtapesProcedure.svelte';
  import OutilJeuCarteReflexesCyber from './outils/OutilJeuCarteReflexesCyber.svelte';
  import OutilJeuReflexesCyberEnLigne from './outils/OutilJeuReflexesCyberEnLigne.svelte';
</script>

<div>
  <h2>S’entraîner à gérer une crise cyber</h2>
  <p class="texte-mention-xs">
    Cette démarche est proposée à titre indicatif. Vous êtes libre de l’adapter à votre contexte et de mobiliser les
    outils et méthodes de votre choix.
  </p>
  <EtapesProcedure>
    <EtapeProcedure titre="Organisez un premier exercice simple avec votre équipe">
      <p class="texte-standard-md">
        Pas besoin de mettre en place un exercice complexe pour commencer&nbsp;: un format «&nbsp;sur table&nbsp;»
        suffit. Réunissez les personnes clés de votre organisation&nbsp;: direction, informatique ou prestataire IT,
        communication et métiers concernés.
      </p>
      <p class="texte-standard-md">
        À partir d’un scénario réaliste (rançongiciel, fuite de données, messagerie indisponible…), échangez ensemble
        sur les décisions à prendre.
      </p>
      <div class="outils-reflexes-cyber">
        <OutilJeuCarteReflexesCyber />
        <OutilJeuReflexesCyberEnLigne />
      </div>
    </EtapeProcedure>
    <EtapeProcedure titre="Identifiez les axes d’améliorations">
      <p class="texte-standard-md">
        À la fin de l’exercice, notez les difficultés rencontrées et les actions à mettre en place pour être mieux
        préparés en cas de véritable incident, par exemple&nbsp;: qui alerter en premier&nbsp;? Qui prend les
        décisions&nbsp;? Comment continuer à travailler&nbsp;? Comment informer les salariés, clients ou
        partenaires&nbsp;? Où trouver les contacts d’urgence&nbsp;?
      </p>

      <Lien
        blank
        libelle="8 fiches réflexes cyber"
        href="/documents-ressources/ReflexesCyber%20-%20Fiches%20Reflexes.pdf"
      />
    </EtapeProcedure>
    <EtapeProcedure titre="Structurez et outillez la gestion de crise de votre organisation">
      <p class="texte-standard-md">
        Votre organisation est prête à aller plus loin ? Il est maintenant est nécessaire de préparer et d’outiller la
        gestion de crise cyber de votre organisation, notamment en&nbsp;:
      </p>
      <ul class="enumeration">
        <li>
          Formalisant le dispositif de gestion de crises cyber (gouvernance, rôles, outils, procédures, etc.)&nbsp;;
        </li>
        <li>
          Établissant un plan de continuité d’activité (PCA) robuste aux cyberattaques et un plan de reprise d’activité
          (PRA)&nbsp;;
        </li>
        <li>
          S’assurant de disposer des capacités de réponse à incident, notamment en cas de perte des moyens informatiques
          et de communication&nbsp;;
        </li>
        <li>Se dotant d’une stratégie de communication en cas de crise cyber&nbsp;;</li>
        <li>
          Si possible, en contractualisant, avec un prestataire de réponse à incident et en souscrivant à une assurance
          cyber.
        </li>
      </ul>
      <p class="texte-standard-md">Pour vous aider&nbsp;:</p>
      <ul class="enumeration">
        <li>
          <Lien
            libelle="Le guide ANSSI «&nbsp;Crise cyber, les clés d’une gestion opérationnelle et stratégique&nbsp;»"
            blank
            href="/guides/crise-cyber-les-cles-dune-gestion-operationnelle-et-strategique"
          />
        </li>
        <li>
          <Lien
            libelle="Le guide ANSSI «&nbsp;Anticiper et gérer sa communication de crise cyber&nbsp;»"
            blank
            href="/guides/anticiper-et-gerer-sa-communication-de-crise-cyber"
          />
        </li>
      </ul>
    </EtapeProcedure>
    <EtapeProcedure titre="Organisez des exercices de crise réguliers">
      <p class="texte-standard-md">
        Il est important de continuer à sensibiliser et à entraîner à intervalle régulier vos équipes en vous dotant
        d’une stratégie d’entraînements.
      </p>
      <p class="texte-standard-md">
        Vous pouvez, pour cela, vous appuyer sur la collection de kits d’exercices de l’ANSSI&nbsp;:
      </p>
      <ul class="enumeration">
        <li>
          <Lien
            libelle="Le guide «&nbsp;Organiser un exercice de gestion de crise cyber&nbsp;»"
            blank
            href="/guides/organiser-un-exercice-de-gestion-de-crise-cyber"
          />
        </li>
        <li>
          <Lien
            libelle="Des kits d’exercices sectoriels et pour les collectivités"
            blank
            href="https://cyber.gouv.fr/securisation/gestion-de-crise/entrainement-crise/"
          />
        </li>
      </ul>
    </EtapeProcedure>
  </EtapesProcedure>
  <h3>Pour aller plus loin</h3>
  <Lien
    libelle="La collection complète des guides de l’ANSSI sur la gestion des crises cyber"
    blank
    href="/catalogue#?collections=crise-cyber"
  />
</div>

<style lang="scss">
  .texte-mention-xs {
    font-style: italic;
  }

  .enumeration {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style-type: disc;
    padding: 0 0 1.5rem 1.5rem;
  }

  .outils-reflexes-cyber {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
