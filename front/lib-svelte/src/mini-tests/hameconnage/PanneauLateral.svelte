<script lang="ts">
  import { mailOuvert, tousLesMails } from './hameconnage.store';
  import PanneauActionsMail from './PanneauActionsMail.svelte';

  let { urlBase = '' }: { urlBase?: string } = $props();

  const nombreTotalMails = $derived($tousLesMails.length);
  const nombreTotalMailRépondu = $derived($tousLesMails.filter((mail) => mail.réponseUtilisateur).length);
  const score = $derived($tousLesMails.filter((mail) => mail.réponseUtilisateur === 'bonne').length);
</script>

<aside>
  <div class="carte-score panneau">
    <p class="texte-article-lg">{`email ${nombreTotalMailRépondu} sur ${nombreTotalMails}`}</p>
    <div class="score">
      <lab-anssi-icone nom="shield-fill" taille="md"></lab-anssi-icone>
      <p class="texte-article-lg">{score}</p>
    </div>
  </div>
  {#if $mailOuvert}
    <PanneauActionsMail mode="bureau" {urlBase} />
  {:else}
    <div class="panneau">
      <p class="texte-detail-sm">
        Ouvrez un à un les emails et tentez de determinez lesquels sont légitimes et lesquels ne le sont pas
      </p>
    </div>
  {/if}
</aside>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  aside {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;

    @include a-partir-de(lg) {
      width: taille-pour-colonnes(4);
    }

    p {
      margin-bottom: 0;
    }

    .panneau {
      background-color: white;
      border-bottom: 1px solid var(--border-default-grey);
      padding: 1.5rem;
    }

    .carte-score {
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        font-weight: bold;
        color: var(--text-label-blue-france);
      }

      .score {
        display: flex;
        align-items: center;
        padding-inline: 0.5rem;
        justify-content: space-between;
        border: 1px solid var(--border-action-low-blue-france);
        border-radius: 0.25rem;

        lab-anssi-icone {
          color: var(--artwork-minor-blue-france);
        }

        p {
          width: 2rem;
          text-align: right;
        }
      }
    }
  }
</style>
