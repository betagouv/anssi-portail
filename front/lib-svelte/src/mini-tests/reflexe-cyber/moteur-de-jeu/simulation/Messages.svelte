<script lang="ts">
</script>

<div class="messages">
  <div class="titre">
    <lab-anssi-icone nom="message-2-line" taille="md"> </lab-anssi-icone>
    <h6>Messages</h6>
    <div class="nombre">99</div>
  </div>
  <div class="message">
    <div class="sous-titre">
      <img src="/assets/images/mini-tests/reflexe-cyber/role-direction.avif" alt="" />
      <p class="texte-standard-md">Direction</p>
    </div>
    <p class="texte-detail-sm">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vestibulum eleifend ante, et fermentum nulla
      laoreet sagittis.
    </p>
  </div>
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
</style>
