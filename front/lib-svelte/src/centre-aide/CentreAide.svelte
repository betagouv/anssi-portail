<script lang="ts">
  import { fly } from 'svelte/transition';

  let ouvert: boolean = false;
</script>

{#if !ouvert}
  <button
    class="declencheur-centre-aide"
    on:click={() => (ouvert = true)}
    transition:fly={{ y: 300 }}
  >
    <img
      src="/assets/images/icone-centre-aide.svg"
      alt="Icône du centre d'aide"
    />
    Centre d'aide
  </button>
{/if}

{#if ouvert}
  <div class="centre-aide" transition:fly={{ y: 300 }}>
    <div class="entete">
      <div>
        <img
          src="/assets/images/icone-centre-aide.svg"
          alt="Icône du centre d'aide"
        />
        <h4>Centre d'aide</h4>
      </div>
      <button on:click={() => (ouvert = false)}>
        <img
          src="/assets/images/icone-croix-blanche.svg"
          alt="Icône de fermeture du centre d'aider"
        />
      </button>
    </div>
    <div class="contenu">
      <div class="message">
        <span
          >Bonjour et bienvenue sur MesServicesCyber. Comment pouvons-nous vous
          aider ?</span
        >
      </div>
      <a
        class="bouton primaire"
        href="https://aide.messervices.cyber.gouv.fr/fr/?chat=ouvert"
        target="_blank">💬 Nous contacter par chat</a
      >
      <a
        class="bouton primaire"
        href="https://aide.messervices.cyber.gouv.fr/fr/"
        target="_blank">🙌 Consulter la F.A.Q.</a
      >
      <div class="message marge-haute">
        <span>Vous souhaitez faire une autre demande à l'ANSSI ?</span>
      </div>
      <a
        class="bouton secondaire centre-aide-signaler-incident"
        href="https://club.ssi.gouv.fr/#/declarations"
        target="_blank">️⚠️ Signaler un incident ou une vulnérabilité</a
      >
      <a
        class="bouton secondaire centre-aide-contacter-anssi"
        href="https://cyber.gouv.fr/contacter-lanssi"
        target="_blank">️📩 Contacter d’autres services de l’ANSSI</a
      >
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .declencheur-centre-aide {
    position: fixed;
    bottom: 24px;
    right: 24px;
    border-radius: 100px;
    border: 1px solid #fff;
    background: #0d0c21 url('/assets/images/motif-fond-service-opacite-16.png');
    box-shadow: 0 4px 12px 0 rgba(0, 0, 18, 0.16);
    color: #f5f5fe;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    display: flex;
    gap: 8px;
    padding: 10px 24px 10px 18px;
    cursor: pointer;
    z-index: 8;

    @include a-partir-de(sm) {
      bottom: 48px;
      right: 48px;
    }
  }

  .centre-aide {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 9;

    @include a-partir-de(sm) {
      width: 520px;
      height: 576px;
      top: unset;
      left: unset;
      bottom: 48px;
      right: 48px;

      border-radius: 8px;
      border: 1px solid #fff;
      box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    }

    .entete {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0d0c21
        url('/assets/images/motif-fond-service-opacite-16.png');

      @include a-partir-de(sm) {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }

      h4 {
        color: white;
        font-size: 22px;
        font-weight: 700;
        line-height: 28px;
        margin: 0;
      }

      div {
        display: flex;
        flex-direction: row;
        gap: 16px;
      }

      button {
        border: none;
        background: none;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }

    .contenu {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      @include a-partir-de(sm) {
        padding: 32px;
      }

      .message {
        display: flex;
        padding: 16px;
        border-radius: 8px;
        background: #ededed;

        color: #161616;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5rem;

        &.marge-haute {
          margin-top: 16px;
        }
      }

      a {
        padding: 8px 12px;
        font-size: 1rem;
        line-height: 1.5rem;
        width: 100%;
        box-sizing: border-box;

        @include a-partir-de(sm) {
          width: fit-content;
        }

        &.secondaire {
          border-color: var(--noir);
        }
      }
    }
  }
</style>
