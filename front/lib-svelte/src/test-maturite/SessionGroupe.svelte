<script lang="ts">
  import axios from 'axios';
  import Bouton from '../ui/Bouton.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import ControleFormulaire from '../ui/ControleFormulaire.svelte';
  import Formulaire from '../ui/Formulaire.svelte';
  import ModaleNouvelleSessionGroupe from './ModaleNouvelleSessionGroupe.svelte';
  import type { ReponseCreationSessionGroupe } from './SessionGroupe';

  let codeSession = '';
  let creationNouvelleSession = false;
  let modaleNouvelleSession: ModaleNouvelleSessionGroupe;
  let champCodeSession: ChampTexte;
  let formulaire: Formulaire;

  const saisieCodeSession = () => {
    if (codeSession.length === 3) {
      codeSession += '-';
    }
    codeSession = codeSession.toUpperCase();
    champCodeSession.setValiditePersonnalisee('');
  };

  const nouvelleSession = async () => {
    try {
      creationNouvelleSession = true;
      const reponse = await axios.post<ReponseCreationSessionGroupe>(
        '/api/sessions-groupe'
      );
      modaleNouvelleSession.ouvre(reponse.data);
    } finally {
      creationNouvelleSession = false;
    }
  };

  const rejoindreSession = async () => {
    if (formulaire.estValide()) {
      const codeSansTiret = codeSession.replaceAll('-', '');
      try {
        await axios.get(`/api/sessions-groupe/${codeSansTiret}`);
        window.location.href = `/test-maturite?session-groupe=${codeSansTiret}`;
      } catch {
        champCodeSession.setValiditePersonnalisee('Code non trouvé');
      }
    }
  };
</script>

<section>
  <div class="contenu-section">
    <div class="bloc-role organisateur">
      <div class="role">Organisateur</div>
      <h3>Lancer une session de groupe</h3>
      <p>
        <b>
          Vous organisez un atelier ou un événement autour de la cybersécurité ?
        </b>
        <br /><br />
        Générez un code de session à partager avec les participants. Vous pourrez
        ensuite comparer les résultats obtenus.
      </p>
      <Bouton
        titre="Nouvelle session"
        type="secondaire"
        taille="md"
        classe="bouton-session-groupe"
        enCoursEnvoi={creationNouvelleSession}
        on:click={nouvelleSession}
      />
      <ModaleNouvelleSessionGroupe bind:this={modaleNouvelleSession} />
    </div>

    <div class="bloc-role participant">
      <div class="role">Participant</div>
      <h3>Rejoindre une session de groupe</h3>
      <p>
        <b>Vous participez à une session de groupe ?</b>
        <br /><br />
        Saisissez-le ci-dessous pour accéder au test de maturité cyber lancé par
        votre animateur. Votre résultat est anonyme.
      </p>
      <Formulaire bind:this={formulaire}>
        <ControleFormulaire
          libelle="Code de session"
          sousTitre="Saisissez le code fourni par votre organisateur"
          requis
        >
          <ChampTexte
            bind:this={champCodeSession}
            id="codeSession"
            nom="codeSession"
            requis={true}
            modele={'[A-Z1-9]{3}-?[A-Z1-9]{3}'}
            bind:valeur={codeSession}
            messageErreur="Renseigner un code de session en cours valide."
            class="champ-session-groupe"
            autocomplete="off"
            on:input={saisieCodeSession}
            maxlength="7"
          />
        </ControleFormulaire>
        <Bouton
          titre="Débuter le test"
          type="primaire"
          taille="md"
          classe="bouton-session-groupe"
          on:click={rejoindreSession}
        />
      </Formulaire>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .contenu-section {
    padding: 56px var(--gouttiere) 56px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-sizing: border-box;
    @include a-partir-de(lg) {
      flex-direction: row;
    }
  }

  .bloc-role {
    padding: 40px;
    border: 1px solid var(--border-default-grey);
    border-radius: 8px;

    &.organisateur {
      background-color: #f6f6f6;
      border-color: #f6f6f6;
    }

    h3 {
      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: bold;
      margin: 4px 0 8px;
      @include a-partir-de(md) {
        font-size: 1.75rem;
        line-height: 2.25rem;
      }
    }

    p {
      margin: 0 0 32px;
    }

    :global(.champ-session-groupe) {
      width: 100%;
      @include a-partir-de(sm) {
        width: auto;
      }
    }

    :global(.bouton-session-groupe) {
      width: 100%;

      @include a-partir-de(sm) {
        width: auto;
      }
    }

    .role {
      font-size: 0.875rem;
      line-height: 1.5rem;
      text-transform: uppercase;
      font-weight: bold;
      color: #666666;
    }
  }
</style>
