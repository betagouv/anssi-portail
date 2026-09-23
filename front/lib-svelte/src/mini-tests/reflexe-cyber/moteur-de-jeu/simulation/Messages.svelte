<script lang="ts">
  import { onMount } from 'svelte';
  import { type Rôle } from '../roles';

  let {
    défilementActif,
    messagesÀAfficher,
    surMessageAffiché,
  }: {
    défilementActif: boolean;
    messagesÀAfficher: { rôle: Rôle; message: string }[];
    surMessageAffiché: () => void;
  } = $props();

  let nombreMessagesAffichés = $state(0);

  let numéroMessageAffiché = $state(0);
  const messageAffiché = $derived(messagesÀAfficher[numéroMessageAffiché]);

  $effect(() => {
    messagesÀAfficher;
    numéroMessageAffiché = 0;
  });

  let intervale: NodeJS.Timeout | undefined = undefined;

  $effect(() => {
    if (défilementActif) {
      intervale = setInterval(() => {
        if (défilementActif && numéroMessageAffiché < messagesÀAfficher.length - 1) {
          nombreMessagesAffichés++;
          entre = false;
          sors = true;
          setTimeout(() => {
            numéroMessageAffiché++;
            surMessageAffiché();
            entre = true;
            sors = false;
            setTimeout(() => (entre = false), 500);
          }, 400);
        }
      }, 5000);
      setTimeout(() => {
        nombreMessagesAffichés++;
        surMessageAffiché();
        entre = true;
        sors = false;
        setTimeout(() => (entre = false), 500);
      }, 0);
    } else {
      clearInterval(intervale);
    }
  });

  onMount(() => {
    return () => clearInterval(intervale);
  });

  let entre = $state(false);
  let sors = $state(false);
</script>

<div class="messages">
  <div class="titre">
    <lab-anssi-icone nom="message-2-line" taille="md"> </lab-anssi-icone>
    <h6>Messages</h6>
    <div class="nombre">{nombreMessagesAffichés}</div>
  </div>
  {#if défilementActif}
    <div class="message" class:entre class:sors>
      <div class="sous-titre">
        <img src={messageAffiché.rôle.image.src} alt={messageAffiché.rôle.image.alt} />
        <p class="texte-standard-md">{messageAffiché.rôle.nom}</p>
      </div>
      <p class="texte-detail-sm">
        {messageAffiché.message}
      </p>
    </div>
  {/if}
</div>

<style lang="scss">
  .messages {
    .titre {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      color: var(--text-title-blue-france);
      margin-bottom: 1rem;

      h6 {
        color: var(--text-title-blue-france);
        margin: 0;
        flex: 1;
      }

      .nombre {
        background-color: var(--background-flat-error);
        color: var(--text-inverted-grey);
        border-radius: 999px;
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: bold;
        height: 1rem;
        width: 1rem;
        padding: 0.25rem;
        text-align: center;
      }
    }

    .message {
      padding: 1rem 1rem 1.5rem;
      background-color: var(--background-alt-yellow-moutarde);
      transform: translateX(0);
      will-change: opacity, transform;

      &.entre {
        animation: entrée-message 0.62s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      &.sors {
        animation: sortie-message 0.28s ease-in both;
      }

      .sous-titre {
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.625rem;

        img {
          border-radius: 999px;
          object-fit: cover;
          object-position: center;
          border: 2px solid white;
          width: 3rem;
          height: 3rem;
        }

        p {
          margin-bottom: 0;
          font-weight: bold;
        }
      }

      .texte-detail-sm {
        margin: 0;
      }
    }
  }
  @keyframes entrée-message {
    0% {
      opacity: 0;
      transform: translateX(34px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes sortie-message {
    to {
      opacity: 0;
      transform: translateX(-16px);
    }
  }
</style>
