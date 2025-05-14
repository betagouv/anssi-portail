<script lang="ts">

  import Bouton from '../ui/Bouton.svelte';

  let modaleNouvelleSession: HTMLDialogElement;

  export const ouvre = () => {
    modaleNouvelleSession.showModal();
  };
  const ferme = () => {
    modaleNouvelleSession.close();
  };

</script>
<dialog bind:this={modaleNouvelleSession}>
  <div class="modale">
    <button class="fermer" on:click={ferme}>Fermer</button>
    <h4>Nouvelle session de groupe</h4>
    <div class="contenu">
      <div class="information">
        <p>Partagez ce code ou le QR code aux participants pour leur permettre d’accéder à la session de test de
          maturité
          cyber. Ce code est unique et valable pour cette session uniquement.</p>
        <div class="code">3D8-7B3</div>
      </div>
      <div class="qrcode">
        <div class="conteneur-qrcode">
          <img src="/assets/images/qr-code-demo.svg" alt="QR code" />
        </div>
        <button>Télécharger le QR Code</button>
      </div>
    </div>
    <div class="actions">
      <Bouton titre="Annuler" type="secondaire" taille="md" on:click={ferme} />
      <Bouton titre="Débuter le test" type="primaire" taille="md" />
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

  .fermer {
    font-size: 0.875rem;
    line-height: 1.5rem;
    font-weight: 500;
    border: none;
    background: none;
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 4px 0 4px 12px;
    cursor: pointer;
    align-self: flex-end;
    margin: 0 0 16px;

    &:after {
      content: '';
      display: inline-block;
      background-repeat: no-repeat;
      background-size: contain;
      width: 16px;
      height: 16px;
      line-height: 1.5rem;
      background-image: url('/assets/images/icone-croix.svg');
      filter: brightness(0) saturate(100%);
    }
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

      img {
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