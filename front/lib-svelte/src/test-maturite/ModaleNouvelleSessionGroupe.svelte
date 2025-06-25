<script lang="ts">
  import qrcode from 'qrcode';
  import Bouton from '../ui/Bouton.svelte';
  import type { ReponseCreationSessionGroupe } from './SessionGroupe';
  import BoutonFermerModale from '../ui/BoutonFermerModale.svelte';

  let modaleNouvelleSession: HTMLDialogElement;
  let codeSession: string;
  let codeSessionFormate: string;
  let canvas: HTMLCanvasElement;
  let lienPourParticipants : string;

  export const ouvre = ({
    code,
    lienParticipant,
  }: ReponseCreationSessionGroupe) => {
    codeSession = code;
    lienPourParticipants = lienParticipant;
    qrcode.toCanvas(canvas, lienParticipant, { width: 148, margin: 0 });
    modaleNouvelleSession.showModal();
  };

  const ferme = () => {
    modaleNouvelleSession.close();
  };

  $: codeSessionFormate =
    codeSession && codeSession.slice(0, 3) + '-' + codeSession.slice(3);

  const copieLienParticipant = ()=>{
    navigator.clipboard.writeText(lienPourParticipants).then(function () {
      alert('Lien participant copié dans le presse papier.');
    });
  }
</script>

<dialog bind:this={modaleNouvelleSession}>
  <div class="modale">
    <BoutonFermerModale on:click={ferme}/>
    <h4>Nouvelle session de groupe</h4>
    <div class="contenu">
      <div class="information">
        <p>
          Partagez ce code ou le QR code aux participants pour leur permettre
          d’accéder à la session de test de maturité cyber. Ce code est unique
          et valable pour cette session uniquement.
        </p>
        <div class="code">{codeSessionFormate}</div>
      </div>
      <div class="qrcode">
        <div class="conteneur-qrcode">
          <canvas id="canvas" bind:this={canvas}></canvas>
        </div>
        <button title="Copier dans le presse-papier le lien de participation à la session de groupe" on:click={copieLienParticipant}>
          Copier le lien participant
        </button>
      </div>
    </div>
    <div class="actions">
      <Bouton titre="Annuler" type="secondaire" taille="md" on:click={ferme} />
      <a
        href={`/test-maturite?session-groupe=${codeSession}&organisateur`}
        class="bouton primaire taille-moyenne">Débuter le test</a
      >
    </div>
  </div>
</dialog>

<style lang="scss">
  dialog {
    padding: 16px 32px;
    border: none;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    max-width: 588px;
    box-sizing: border-box;

    &::backdrop {
      background-color: rgba(0, 0, 0, 0.4);
    }
  }

  .modale {
    display: flex;
    flex-direction: column;
  }

  h4 {
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: bold;
    color: #161616;
    margin: 0 0 16px;
    padding: 0;
  }

  p {
    margin: 0 0 16px;
  }

  .code {
    font-size: 2rem;
    font-weight: bold;
    line-height: 2.5rem;
  }

  .contenu {
    display: flex;
    gap: 24px;
  }

  .qrcode {
    display: flex;
    flex-direction: column;
    align-items: center;

    .conteneur-qrcode {
      border: 1px solid var(--gris-clair);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 8px;

      canvas {
        width: 148px;
        height: 148px;
      }
    }

    button {
      padding: 0;
      border: none;
      background: none;
      text-decoration: underline solid var(--noir) 1px;
      text-underline-offset: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      line-height: 1.5rem;

      &:hover {
        text-decoration-thickness: 2px;
      }
    }
  }

  .actions {
    display: flex;
    padding: 48px 0 16px;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
  }
</style>
