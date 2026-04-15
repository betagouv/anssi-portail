<script lang="ts">
  import qrcode from 'qrcode';
  import { tick } from 'svelte';
  import { clic } from '../directives/actions.svelte';
  import Modale from '../ui/Modale.svelte';
  import type { ReponseCreationSessionGroupe } from './SessionGroupe';

  let codeSession = $state<string>('');
  let canvas = $state<HTMLCanvasElement>();
  let lienPourParticipants = $state<string>('');

  let modaleEstOuverte = $state(false);

  export const ouvre = async ({ code, lienParticipant }: ReponseCreationSessionGroupe) => {
    codeSession = code;
    lienPourParticipants = lienParticipant;
    modaleEstOuverte = true;
    await tick();
    await qrcode.toCanvas(canvas, lienParticipant, { width: 148, margin: 0 });
  };

  const ferme = () => {
    modaleEstOuverte = false;
  };

  let codeSessionFormate = $derived(codeSession && codeSession.slice(0, 3) + '-' + codeSession.slice(3));

  const copieLienParticipant = () => {
    navigator.clipboard.writeText(lienPourParticipants).then(function () {
      alert('Lien participant copié dans le presse-papier.');
    });
  };

  let lienPourOrganisateur = $derived(
    `${window.location.origin}/test-maturite?session-groupe=${codeSession}&organisateur`
  );

  const copieLienOrganisateur = () => {
    navigator.clipboard.writeText(lienPourOrganisateur).then(function () {
      alert('Lien organisateur copié dans le presse-papier.');
    });
  };
</script>

<Modale bind:estOuverte={modaleEstOuverte}>
  <h4>
    <lab-anssi-icone nom="team-fill" taille="lg"></lab-anssi-icone>
    Nouvelle session de groupe
  </h4>
  <div class="information">
    <p>
      Partagez ce code ou le QR code aux participants pour leur permettre d’accéder à la session de test de maturité
      cyber. Ce code est unique et valable pour cette session uniquement.
    </p>
  </div>
  <div class="qrcode">
    <canvas bind:this={canvas}></canvas>
    <div>
      <p class="texte-standard-md">Code de session</p>
      <h2 class="code">{codeSessionFormate}</h2>
      <dsfr-button
        label="Copier le lien participant"
        title="Copier dans le presse-papier le lien de participation à la session de groupe"
        size="sm"
        kind="tertiary"
        hasIcon
        iconPlace="left"
        icon="link"
        use:clic={copieLienParticipant}
      >
      </dsfr-button>
    </div>
  </div>
  <div class="organisateur texte-detail-sm">
    <p>
      Copiez ce lien si vous souhaitez accéder à votre session organisateur ultérieurement&nbsp;:<br />
      <u>session-groupe={codeSession}&organisateur</u>
      <dsfr-button
        title="Copier dans le presse-papier le lien organisateur de la session de groupe"
        size="sm"
        kind="tertiary-no-outline"
        hasIcon
        iconPlace="only"
        icon="link"
        use:clic={copieLienOrganisateur}
      >
      </dsfr-button>
    </p>
  </div>
  {#snippet actions()}
    <dsfr-button
      label="Débuter le test"
      title="Débuter le test de maturité cyber en tant qu'organisateur"
      size="md"
      kind="primary"
      markup="a"
      href={`/test-maturite?session-groupe=${codeSession}&organisateur`}
      centered
    ></dsfr-button>
    <dsfr-button label="Annuler" title="Annuler" kind="secondary" size="md" use:clic={ferme} centered></dsfr-button>
  {/snippet}
</Modale>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  h4 {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: bold;
    color: #161616;
    margin: 16px 0 16px;
    padding: 0;
  }

  p {
    margin: 0 0 16px;
  }

  .information {
    margin-bottom: 24px;
  }

  .qrcode {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    gap: 0 24px;

    canvas {
      border: 1px solid var(--border-default-grey);
      border-radius: 8px;
      margin-bottom: 16px;
      padding: 16px;
      width: 148px;
      height: 148px;
    }

    .texte-standard-md {
      margin-bottom: 0;
    }

    .code {
      margin-bottom: 16px;
    }
  }

  @include a-partir-de(md) {
    .qrcode {
      flex-direction: row;
    }
  }
</style>
