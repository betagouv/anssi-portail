<script lang="ts">
  import EtapeProcedure from './EtapeProcedure.svelte';
  import EtapesProcedure from './EtapesProcedure.svelte';
</script>

<div>
  <h2>Établissez votre annuaire de crise à imprimer</h2>
  <p class="texte-mention-xs">
    Cette démarche est proposée à titre indicatif. Vous êtes libre de l’adapter à votre contexte et de mobiliser les
    outils et méthodes de votre choix.
  </p>

  <EtapesProcedure>
    <EtapeProcedure>
      <p class="texte-standard-md">
        <strong>Identifiez les rôles et les contacts à mobiliser en cas de cyberattaque</strong><br /><br />
        Listez, dans votre entité, qui assure la décision, l'informatique, la communication, le juridique et le lien avec
        l'assurance (une personne peut cumuler plusieurs rôles), et ajoutez les contacts externes clés (prestataire IT, hébergeur,
        banque, assureur, forces de l'ordre, Cybermalveillance.gouv.fr, ANSSI/CERT). Pour chacun : nom, fonction, téléphone,
        email et références utiles (contrat, police d'assurance, astreinte).<br /><br />
        <em
          >Utilisez notre modèle d'annuaire de crise : il propose déjà des contacts pré-identifiés selon votre région et
          des exemples de rôles à adapter . A vous de le compléter avec les rôles et les personnes propres à votre
          organisation.</em
        >
      </p>
      <dsfr-card
        title="Téléchargez notre modèle d’annuaire de crise"
        size="sm"
        horizontal="true"
        has-description="true"
        description="XLSX"
        download="true"
        href="#"
        enlarge="true"
        has-badge="true"
        src="/assets/images/parcours-securisation/outils/icone-telechargement-xlsx.svg"
        has-header-badge
      >
        <div slot="headerbadges">
          <dsfr-badge label="Outil sécurisation" type="status" status="success" size="md"></dsfr-badge>
        </div>
      </dsfr-card>
    </EtapeProcedure>

    <EtapeProcedure>
      <p class="texte-standard-md">
        <strong>Imprimez et répartissez plusieurs exemplaires</strong><br /><br />
        Imprimer plusieurs exemplaires et les répartir intelligemment : classeur de crise au bureau, domicile du dirigeant,
        véhicule ou sac du responsable informatique. Le principe : la liste doit rester lisible sans ordinateur, sans réseau
        et sans internet.
      </p>
    </EtapeProcedure>

    <EtapeProcedure>
      <p class="texte-standard-md">
        <strong>Protégez la diffusion du document</strong><br /><br />
        Protéger le document : il contient des données personnelles et une cartographie de vos prestataires. Informer les
        personnes concernées, limiter la diffusion aux seules personnes utiles, et ne pas laisser d’exemplaires traîner dans
        des espaces communs.
      </p>
    </EtapeProcedure>

    <EtapeProcedure>
      <p class="texte-standard-md">
        <strong>Maintenez la liste à jour</strong><br /><br />
        Maintenir à jour cette liste, notamment à chaque départ, arrivée ou changement de prestataire.<br /><br />
        <em
          >En confirmant avoir pris en compte cette mesure, un rappel automatique vous sera envoyé par e-mail dans un an
          pour vérifier que le fichier est toujours à jour (désactivable depuis votre espace Notifications et
          consentement).</em
        ><br /><br />
        <em>Vous pouvez aussi l'ajouter directement à votre propre agenda&nbsp;:</em>
      </p>
    </EtapeProcedure>
  </EtapesProcedure>
</div>

<style lang="scss">
  .texte-mention-xs {
    font-style: italic;
  }

  .texte-standard-md {
    margin-bottom: 0;
  }

  dsfr-card {
    margin-top: 1.5rem;
    min-height: auto;
  }
</style>
