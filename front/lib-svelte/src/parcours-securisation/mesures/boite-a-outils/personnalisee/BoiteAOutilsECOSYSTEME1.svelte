<script lang="ts">
  import ÉtapeProcédure from '../EtapeProcedure.svelte';
  import ÉtapesProcédure from '../EtapesProcedure.svelte';
  import NoteProcedure from '../NoteProcedure.svelte';
  import OutilModèleListePrestatairesEtFournisseurs from './outils/OutilModeleListePrestatairesEtFournisseurs.svelte';
  import OutilRappelMiseÀJourListePrestatairesEtFournisseurs from './outils/OutilRappelMiseAJourListePrestatairesEtFournisseurs.svelte';
</script>

<div>
  <h2>Créez et tenez à jour votre annuaire de contacts informatiques</h2>
  <NoteProcedure />

  <ÉtapesProcédure>
    <ÉtapeProcédure titre="Recensez vos prestataires et fournisseurs informatiques">
      <p class="texte-standard-md">
        Listez tous les prestataires et fournisseurs informatiques avec lesquels vous avez un contrat et qui contribuent
        à vos activités ou services. Pensez à votre infogérant, à vos hébergeurs et aux éditeurs de vos logiciels en
        ligne, y compris les outils de RH ou de comptabilité.
      </p>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Renseignez les coordonnées et les informations utiles">
      <div class="contenu-etape">
        <OutilModèleListePrestatairesEtFournisseurs />
        <p class="texte-standard-md">
          Pour chaque prestataire ou fournisseur, indiquez les informations suivantes&nbsp;:
        </p>
        <ul class="texte-standard-md">
          <li>
            <b>Nom du prestataire ou du fournisseur&nbsp;:</b> indiquez le nom qui figure sur le contrat ou la facture.
          </li>
          <li>
            <b>Nature de la prestation ou du service&nbsp;:</b> précisez ce que le prestataire fournit, par exemple l’hébergement
            d’un site web ou la maintenance du parc informatique.
          </li>
          <li>
            <b>Périmètre de la prestation&nbsp;:</b> indiquez les systèmes, les outils ou les activités concernés, par exemple
            le site vitrine ou les postes de travail du siège.
          </li>
          <li>
            <b>Contact opérationnel&nbsp;:</b> indiquez le nom, la fonction, l’adresse e-mail et le numéro de téléphone de
            votre interlocuteur principal.
          </li>
          <li>
            <b>Contact de secours ou d’astreinte&nbsp;:</b> indiquez qui joindre si le contact principal est indisponible.
            Si une astreinte est prévue, précisez ses horaires et comment la joindre.
          </li>
          <li>
            <b>Référence du contrat et date d’échéance&nbsp;:</b> relevez la référence qui permet de retrouver le contrat
            et la date à laquelle il arrive à échéance.
          </li>
        </ul>
      </div>
    </ÉtapeProcédure>

    <ÉtapeProcédure titre="Mettez la liste à jour à chaque changement">
      <div class="contenu-etape">
        <p class="texte-standard-md">
          Actualisez la liste dès qu’un prestataire est ajouté, qu’un contact ou les modalités d’astreinte changent, ou
          qu’un contrat prend fin. Vérifiez l’ensemble de la liste au moins une fois par an.
        </p>
        <OutilRappelMiseÀJourListePrestatairesEtFournisseurs />
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
