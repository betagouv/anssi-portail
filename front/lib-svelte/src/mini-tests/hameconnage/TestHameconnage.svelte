<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import { fabriqueFilAriane } from '../../ui/filAriane';
  import FilAriane from '../../ui/FilAriane.svelte';
</script>

<dsfr-container>
  <FilAriane
    segments={fabriqueFilAriane({
      feuille: 'Hameçonnage : saurez-vous distinguer le mail légitime du faux&nbsp;?',
      branche: { nom: 'Faire le test !', lien: '/faire-le-test' },
    })}
  />

  <h1 class="fr-h6">Hameçonnage&nbsp;: saurez-vous distinguer le mail légitime du faux&nbsp;?</h1>
  <aside>
    <div class="carte-score panneau">
      <p class="texte-article-lg">email 1 sur 9</p>
      <div class="score">
        <lab-anssi-icone nom="shield-fill" taille="md"></lab-anssi-icone>
        <p class="texte-article-lg">3</p>
      </div>
    </div>
    <div class="panneau">
      <p class="texte-detail-sm">
        Ouvrez un à un les email et tentez de determinez lesquels sont légitimes et lesquels ne le sont pas
      </p>
    </div>
  </aside>
  <div class="boite-mail">
    <div class="champ-recherche">
      <lab-anssi-icone nom="search-line" taille="sm"></lab-anssi-icone>
      <input placeholder="Chercher votre mail" />
    </div>
    <div class="mails">
      <div class="mail non-lu">
        <div class="libelles">
          <span class="expediteur">EDF - Service Recouvrement</span>
          <span class="objet">Usurpation d'organisme parapublic - urgence de coupure de service</span>
        </div>
        <div class="infos">
          <span class="heure">10:34</span>
          <Bouton type="tertiaire-sans-bordure" taille="sm" iconeSeule icone="arrow-right-line" />
        </div>
      </div>
      <div class="mail lu">
        <div class="libelles">
          <span class="expediteur">EDF - Service Recouvrement</span>
          <span class="objet">Usurpation d'organisme parapublic - urgence de coupure de service</span>
        </div>
        <div class="infos">
          <span class="heure">10:34</span>
          <img src="/assets/icones/coche-verte.svg" alt="Bonne réponse" />
        </div>
      </div>
    </div>
  </div>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    background-color: var(--background-alt-blue-france);
    display: flex;
    flex-direction: column;
    padding-bottom: 1.5rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  aside {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;

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
        box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);

        lab-anssi-icone {
          color: #8585f6;
          // couleur de la maquette, non présente dans le thème clair, uniquement dans le thème sombre du DSFR (--artwork-major-blue-france)
        }

        p {
          width: 2rem;
          text-align: right;
        }
      }
    }
  }

  .boite-mail {
    background-color: white;
    padding-top: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
    display: flex;
    flex-direction: column;
    font-family: Roboto, serif;

    .champ-recherche {
      border-radius: 6.5rem;
      background-color: var(--background-alt-blue-france);
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-inline: 2.5rem;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;

      input {
        border: none;
        background: none;
        display: inline;
        width: 8rem;
        height: 1rem;
      }
    }

    .mail {
      padding: 1rem;
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-default-grey);

      .libelles {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        overflow: hidden;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
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
