<script lang="ts">
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import NoteProcedure from '../NoteProcedure.svelte';
  import OutilModèleListeInterconnexions from './outils/OutilModeleListeInterconnexions.svelte';
  import OutilRappelMiseÀJourListeInterconnexions from './outils/OutilRappelMiseAJourListeInterconnexions.svelte';
</script>

<div>
  <h2>Recensez vos interconnexions et identifiez les contacts associés</h2>
  <NoteProcedure />

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Repérez les connexions à inventorier">
      <p class="texte-standard-md">
        Partez de vos schémas réseau et de la liste de vos services numériques. Si besoin, demandez à votre équipe
        informatique ou à votre infogérant de vous aider à repérer les connexions suivantes.
      </p>
      <ul>
        <li>
          <b>Accès à Internet et services en ligne&nbsp;:</b> messagerie, sauvegarde dans le cloud et logiciels en ligne.
        </li>
        <li>
          <b>Connexions entre sites ou organisations&nbsp;:</b> VPN avec un partenaire ou une filiale, accès à l’intranet
          du groupe.
        </li>
        <li>
          <b>Accès de maintenance à distance&nbsp;:</b> repérez quels prestataires se connectent, depuis où et à quels systèmes.
        </li>
        <li>
          <b>Échanges automatisés de données&nbsp;:</b> flux de paiement et échanges de données informatisés (EDI), par exemple
          pour transmettre des commandes ou des factures.
        </li>
      </ul>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Identifiez les systèmes reliés et la personne à joindre">
      <div class="contenu-etape">
        <OutilModèleListeInterconnexions />
        <p class="texte-standard-md">
          Si vous créez votre propre tableau, prévoyez une ligne par interconnexion et renseignez les informations
          suivantes.
        </p>
        <ul class="texte-standard-md">
          <li>
            <b>Systèmes concernés des deux côtés&nbsp;:</b> indiquez quel système se connecte à quel autre. Par exemple, votre
            logiciel de gestion des commandes échange des données avec la plateforme de votre fournisseur.
          </li>
          <li>
            <b>Point de contact opérationnel de l’autre côté&nbsp;:</b> indiquez le nom de la personne ou de l’équipe qui
            peut intervenir sur la connexion, ainsi que son adresse e-mail et son numéro de téléphone. Il peut s’agir d’un
            contact chez un partenaire ou dans une autre équipe de votre organisation.
          </li>
        </ul>
      </div>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Mettez la liste à jour quand les connexions évoluent">
      <div class="contenu-etape">
        <p class="texte-standard-md">
          Ajoutez, modifiez ou retirez les lignes concernées lorsqu’une connexion est créée, modifiée ou supprimée. Lors
          de la revue annuelle, vérifiez que les connexions sont toujours utilisées et que les contacts sont joignables.
        </p>
        <OutilRappelMiseÀJourListeInterconnexions />
      </div>
    </ÉtapeProcédure>
  </ÉtapesProcédure>
</div>

<style lang="scss">
  .contenu-etape {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    p,
    ul {
      margin: 0;
    }
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;

    li + li {
      margin-top: 0.5rem;
    }
  }
</style>
