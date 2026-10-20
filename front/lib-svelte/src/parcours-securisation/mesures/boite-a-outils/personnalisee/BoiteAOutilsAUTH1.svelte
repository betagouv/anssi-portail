<script lang="ts">
  import EtapeProcedure from '../EtapeProcedure.svelte';
  import EtapesProcedure from '../EtapesProcedure.svelte';
  import OutilModeleModificationMotsDePasse from './outils/OutilModeleModificationMotsDePasse.svelte';
</script>

<div>
  <h2>Changement des mots de passe par défaut</h2>
  <p class="texte-mention-xs">
    Cette démarche est proposée à titre indicatif. Vous êtes libre de l’adapter à votre contexte et de mobiliser les
    outils et méthodes de votre choix.
  </p>
  <EtapesProcedure>
    <EtapeProcedure titre="Faire la liste des équipements et logiciels à vérifier">
      <p class="texte-standard-md">
        box internet, routeur, pare-feu, switch, imprimantes, stockage réseau (NAS), caméras, objets connectés,
        applications métier, etc.
      </p>
      <p class="texte-detail-sm explication">
        Pour vous aider, utilisez notre liste prête à l’emploi d’équipements susceptibles d’avoir un mot de passe par
        défaut. Cette liste est indicative et non exhaustive&nbsp;: pensez à la compléter et à l’adapter aux équipements
        de votre organisation.
      </p>
      <OutilModeleModificationMotsDePasse />
    </EtapeProcedure>
    <EtapeProcedure titre="Retrouver les identifiants d'origine">
      <ul class="enumeration">
        <li>étiquette collée sous l'appareil ou au dos&nbsp;;</li>
        <li>documentation ou notice du fabricant&nbsp;;</li>
        <li>
          site du constructeur (attention&nbsp;: ces mots de passe sont souvent publiés en ligne, c'est bien là le
          problème).
        </li>
      </ul>
    </EtapeProcedure>
    <EtapeProcedure>
      <p class="texte-standard-md">
        Se connecter à l'interface d'administration de chaque équipement (généralement via un navigateur, avec l'adresse
        indiquée dans la notice).
      </p>
    </EtapeProcedure>
    <EtapeProcedure titre="Remplacer identifiant ET mot de passe">
      <ul class="enumeration">
        <li>
          changer aussi le nom du compte quand c'est possible (éviter «&nbsp;admin&nbsp;», «&nbsp;root&nbsp;»,
          «&nbsp;user&nbsp;»)&nbsp;;
        </li>
        <li>choisir un mot de passe long, unique pour chaque équipement, jamais réutilisé ailleurs&nbsp;;</li>
        <li>ne pas se contenter d'ajouter un chiffre au mot de passe d'usine.</li>
      </ul>
    </EtapeProcedure>
    <EtapeProcedure titre="Conserver les nouveaux accès en sécurité">
      <p class="texte-standard-md">
        gestionnaire de mots de passe ou coffre-fort numérique, avec la mention de l'équipement concerné. Ne pas les
        laisser sur un post-it ou dans un fichier partagé.
      </p>
    </EtapeProcedure>
    <EtapeProcedure titre="Traiter en priorité ce qui est le plus exposé">
      <p class="texte-standard-md">
        équipements de sécurité, services accessibles depuis internet, équipements réseau.
      </p>
    </EtapeProcedure>

    <EtapeProcedure>
      <p class="texte-standard-md">
        Refaire le point à chaque nouvel achat, chaque réinstallation et après toute remise à zéro (un «&nbsp;reset
        usine&nbsp;» restaure les mots de passe d'origine).
      </p>
    </EtapeProcedure>
  </EtapesProcedure>
</div>

<style lang="scss">
  .texte-mention-xs,
  .explication {
    font-style: italic;
  }

  .enumeration {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style-type: disc;
    padding: 0 0 1.5rem 1.5rem;
  }
</style>
