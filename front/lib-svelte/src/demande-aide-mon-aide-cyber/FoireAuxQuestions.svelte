<script lang="ts">
  import SectionAccordeon from '../ui/SectionAccordeon.svelte';
</script>

<div class="accordeon">
  <SectionAccordeon>
    <span slot="titre">Mon organisation est-elle concernée&nbsp;?</span>
    <div class="corps" slot="corps">
      <p>
        ✅ <strong
          >Oui, si vous êtes une TPE/PME, une collectivité, ou une association
          avec au moins deux salariés.</strong
        ><br />
        Le diagnostic s’adresse aux structures disposant d’un système d’information
        minimal (ordinateurs, messagerie, réseau partagé...).<br /><br />
      </p>
      <p>
        🚫 <strong>Non, si vous êtes un particulier ou mono-salarié.</strong><br
        />
        Le diagnostic n’est pas adapté à ce profil : trop de questions ne s’appliquent
        pas, et les aidants cyber ne sont pas formés pour ce type d'accompagnement.
      </p>
    </div>
  </SectionAccordeon>
  <SectionAccordeon>
    <span slot="titre"
      >Que risque mon organisation en cas de cyberattaques&nbsp;?</span
    >
    <div class="corps" slot="corps">
      <p>
        🛡️ Les cyberattaques se sont massivement multipliées ces dernières
        années, et <strong>aucune organisation n’est à l’abri</strong>, quelle
        que soit sa taille ou son secteur.<br />
        <br />
        <strong>Les principales conséquences d’une attaque sont :</strong><br />
      </p>
      <ul>
        <li>La perte ou le vol de données (clients, finances, RH…)</li>
        <li>
          L’interruption de vos activités (outils bloqués, services paralysés)
        </li>
        <li>
          Une atteinte à votre réputation ou à la confiance de vos partenaires
        </li>
        <li>Des dépenses imprévues pour réparer ou récupérer vos données</li>
      </ul>
      <p><strong>Découvrez les risques en vidéo</strong></p>
      <!-- Les sous-titres sont intégrés dans la vidéo -->
      <!-- svelte-ignore a11y_media_has_caption -->
      <video
        id="video-risques"
        src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.mp4"
        controls
      ></video>
      <p>
        🔐 Pour agir sans attendre, l’ANSSI (l’Agence nationale de la sécurité
        des systèmes d’information) a créé un diagnostic cyber gratuit, réalisé
        par des Aidants cyber. En 1h30, vous
        <strong>identifiez 6 premières mesures prioritaires,</strong>
        simples et concrètes, pour réduire vos risques et prendre votre “Cyberdépart”
        en toute confiance.
      </p>
    </div>
  </SectionAccordeon>
  <SectionAccordeon>
    <span slot="titre">Qu’est-ce qu’un Aidant cyber&nbsp;?</span>
    <div class="corps" slot="corps">
      <p>
        👤 Un Aidant cyber est un tiers de confiance, issu d’un organisme public
        ou adhérent d’une association à but non lucratif en lien avec le
        numérique, spécialement formé sur le diagnostic cyber par l’ANSSI
        (l’Agence nationale de la sécurité des systèmes d’information). Pour en
        savoir plus, n’hésitez pas à consulter la
        <lab-anssi-lien
          href="https://monaide.cyber.gouv.fr/charte-aidant"
          titre="charte de l’Aidant cyber"
          apparence="lien-texte"
          cible="_blank"
        ></lab-anssi-lien>.<br />
        <br />
        🤝 Son rôle ? <strong>Vous accompagner bénévolement,</strong> de façon
        neutre, confidentielle et bienveillante, pour
        <strong>évaluer la cybersécurité de votre structure</strong>
        et vous proposer des
        <strong>actions concrètes,</strong> accessibles et sans jargon
        technique.<br />
        <br />
        💡 Pas besoin d’être un expert en informatique :
        <strong>
          l’Aidant cyber s’adapte à votre niveau et à vos contraintes.
        </strong>
      </p>
    </div>
  </SectionAccordeon>
  <SectionAccordeon>
    <span slot="titre"
      >Que se passe-t-il après la demande de diagnostic&nbsp;?</span
    >
    <div class="corps" slot="corps">
      <p>📩 Une fois votre demande envoyée :</p>
      <ol>
        <li>
          Un aidant cyber local vous contacte (par email) sous quelques jours
        </li>
        <li>
          Vous planifiez ensemble un rendez-vous, en visio ou dans vos locaux
        </li>
        <li>Le diagnostic est ensuite réalisé en 1h30, gratuitement</li>
        <li>
          Vous recevez ensuite immédiatement une restitution claire avec 6
          mesures prioritaires à mettre en œuvre, et un suivi possible à 6 mois
        </li>
      </ol>
      <p>
        🤝 L’objectif est simple&nbsp;:
        <strong> vous accompagner pas à pas, </strong>
        sans jargon ni pression, pour
        <strong>renforcer concrètement votre cybersécurité.</strong>
      </p>
    </div>
  </SectionAccordeon>
  <SectionAccordeon>
    <span slot="titre">Le diagnostic est-il confidentiel et anonyme&nbsp;?</span
    >
    <div class="corps" slot="corps">
      <p>
        🔒 Oui, le diagnostic est
        <strong>réalisé en toute confidentialité,</strong>
        et <strong>aucune donnée sensible n’est collectée.</strong>
        Pour en savoir plus, n’hésitez pas à consulter notre
        <lab-anssi-lien
          href="/securite"
          titre="page sécurité"
          apparence="lien-texte"
          cible="_blank"
        ></lab-anssi-lien>.<br />
        <br />
        🛡️ Les données sont chiffrées en interne par l’ANSSI, et
        <strong>aucune information nominative</strong>
        ou technique (mots de passe, fichiers, accès système...) n’est requise.<br
        />
        <br />
        💡 Vous gardez le
        <strong>contrôle total sur les échanges,</strong> et bénéficiez d’un accompagnement
        en toute confiance.
      </p>
    </div>
  </SectionAccordeon>
</div>
<div class="besoin-aide">
  <p>
    Participez à un webinaire pour en savoir plus sur le diagnostic cyber.
    <lab-anssi-lien
      href="https://app.livestorm.co/anssi/webinaire-cyberdepart"
      titre="Je m’inscris"
      apparence="lien-texte"
      cible="_blank"
    ></lab-anssi-lien>
  </p>
</div>

<style lang="scss">
  p {
    margin: 0;
  }
  .accordeon {
    .corps {
      padding: 16px 16px 24px;

      video {
        width: 100%;
        margin-top: 16px;
        margin-bottom: 24px;
        border-radius: 10px;
      }
    }
  }

  .besoin-aide {
    margin-top: 48px;
  }
</style>
