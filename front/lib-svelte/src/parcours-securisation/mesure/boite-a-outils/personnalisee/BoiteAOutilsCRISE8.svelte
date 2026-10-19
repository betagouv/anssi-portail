<script lang="ts">
  import EtapeProcedure from '../EtapeProcedure.svelte';
  import EtapesProcedure from '../EtapesProcedure.svelte';
  import OutilRappelMiseAJourAnnuaire from '../OutilRappelMiseAJourAnnuaire.svelte';
  import OutilsModeleAnnuaireDeCrise from '../OutilsModeleAnnuaireDeCrise.svelte';
</script>

<div>
  <h2>Établissez votre annuaire de crise à imprimer</h2>
  <p class="texte-mention-xs">
    Cette démarche est proposée à titre indicatif. Vous êtes libre de l’adapter à votre contexte et de mobiliser les
    outils et méthodes de votre choix.
  </p>

  <EtapesProcedure>
    <EtapeProcedure titre="Identifiez les rôles et les contacts à mobiliser en cas de cyberattaque">
      <p class="texte-standard-md avec-outil">
        Listez, dans votre entité, qui assure la décision, l’informatique, la communication, le juridique et le lien
        avec l’assurance (une personne peut cumuler plusieurs rôles), et ajoutez les contacts externes clés (prestataire
        IT, hébergeur, banque, assureur, forces de l’ordre, Cybermalveillance.gouv.fr, ANSSI/CERT). Pour chacun&nbsp;:
        nom, fonction, téléphone, email et références utiles (contrat, police d’assurance, astreinte).
      </p>
      <p class="texte-detail-sm explication">
        Utilisez notre modèle d’annuaire de crise&nbsp;: il propose déjà des contacts pré-identifiés selon votre région
        et des exemples de rôles à adapter . A vous de le compléter avec les rôles et les personnes propres à votre
        organisation.
      </p>
      <OutilsModeleAnnuaireDeCrise />
    </EtapeProcedure>

    <EtapeProcedure titre="Imprimez et répartissez plusieurs exemplaires">
      <p class="texte-standard-md">
        Imprimer plusieurs exemplaires et les répartir intelligemment&nbsp;: classeur de crise au bureau, domicile du
        dirigeant, véhicule ou sac du responsable informatique. Le principe&nbsp;: la liste doit rester lisible sans
        ordinateur, sans réseau et sans internet.
      </p>
    </EtapeProcedure>

    <EtapeProcedure titre="Protégez la diffusion du document">
      <p class="texte-standard-md">
        Protéger le document&nbsp;: il contient des données personnelles et une cartographie de vos prestataires.
        Informer les personnes concernées, limiter la diffusion aux seules personnes utiles, et ne pas laisser
        d’exemplaires traîner dans des espaces communs.
      </p>
    </EtapeProcedure>

    <EtapeProcedure titre="Maintenez la liste à jour">
      <p class="texte-standard-md">
        Maintenir à jour cette liste, notamment à chaque départ, arrivée ou changement de prestataire.
      </p>
      <p class="texte-detail-sm explication">
        Vous pouvez ajouter directement à votre propre agenda un rappel dans un an pour vérifier que le fichier est
        toujours à jour&nbsp;:
      </p>
      <OutilRappelMiseAJourAnnuaire />
    </EtapeProcedure>
  </EtapesProcedure>
</div>

<style lang="scss">
  .texte-mention-xs,
  .explication {
    font-style: italic;
  }
</style>
