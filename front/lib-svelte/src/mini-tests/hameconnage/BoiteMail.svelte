<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import { mailOuvert, tousLesMails } from './hameconnage.store';
</script>

<div class="boite-mail">
  <div class="entete">
    <h2 class="fr-h3">Ma boîte mail</h2>
    <div class="champ-recherche">
      <lab-anssi-icone nom="search-line" taille="sm"></lab-anssi-icone>
      <input name="recherche-email" placeholder="Chercher votre mail" />
    </div>
  </div>
  <div class="mails">
    {#each $tousLesMails as mail (mail.id)}
      <div class="mail" class:lu={mail.estLu} class:non-lu={!mail.estLu}>
        <div class="libelles">
          <span class="expediteur">{mail.expediteur.nom}</span>
          <span class="objet">{mail.objet}</span>
        </div>
        <div class="infos">
          <span class="heure">{mail.heuresMinutesRéception}</span>
          {#if !mail.estLu}
            <Bouton
              type="tertiaire-sans-bordure"
              taille="sm"
              iconeSeule
              icone="arrow-right-line"
              surClic={() => ($mailOuvert = mail)}
            />
          {:else}
            <img src="/assets/icones/coche-verte.svg" alt="Bonne réponse" />
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  .boite-mail {
    background-color: white;
    padding-top: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
    display: flex;
    flex-direction: column;
    font-family: Roboto, serif;

    .entete {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      gap: 3rem;
      padding-inline: 2.5rem;

      h2 {
        display: none;
        margin-bottom: 0;
        @include a-partir-de(sm) {
          display: block;
        }
      }
      .champ-recherche {
        border-radius: 6.5rem;
        background-color: var(--background-alt-blue-france);
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 0.75rem 1rem;
        flex: 1;
        input {
          border: none;
          background: none;
          display: inline;
          width: 8rem;
          height: 1rem;
        }
      }
    }

    .mail {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-default-grey);
      @include a-partir-de(sm) {
        gap: 2.5rem;
      }

      .libelles {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        overflow: hidden;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @include a-partir-de(sm) {
          display: grid;
          grid-template-columns: 0.5fr 1fr;
          width: 100%;
          gap: 1.5rem;
        }
      }

      .infos {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        .heure {
          position: relative;
          &:after {
            position: absolute;
            content: '';
            background-color: var(--border-default-grey);
            width: 1px;
            top: 0;
            right: -0.75rem;
            bottom: 0;
          }
        }
        :global(dsfr-button) {
          min-height: 2rem;
        }
      }

      &.non-lu {
        border-left: 2px solid var(--border-active-blue-france);
        .libelles {
          .expediteur {
            font-weight: 800;
          }

          .objet {
            font-weight: 500;
          }
        }
        .infos .heure {
          font-weight: 800;
        }
      }

      &.lu {
        .libelles {
          .expediteur {
            font-weight: bold;
          }

          .objet {
            font-weight: normal;
          }
        }
        .infos .heure {
          font-weight: normal;
        }
      }
    }
  }
</style>
