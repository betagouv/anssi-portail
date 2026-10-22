<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import { fabriqueFilAriane } from '../../ui/filAriane';
  import FilAriane from '../../ui/FilAriane.svelte';

  type MailHameçonnage = {
    id: string;
    expediteur: {
      nom: string;
      mail: string;
    };
    destinataire: string;
    objet: string;
    heuresMinutesRéception: string;
    estLu: boolean;
    réponseUtilisateur?: 'bonne' | 'mauvaise';
  };

  const mails: MailHameçonnage[] = [
    {
      id: 'ENEDIS',
      expediteur: {
        nom: 'Enedis - Service Exploitation',
        mail: 'intervention@enedis-exploitation-pro.com',
      },
      destinataire: 'maintenance@votreentreprise.fr',
      objet: 'Anomalie critique détectée sur votre compteur professionnel — Intervention à programmer sous 24h',
      heuresMinutesRéception: '08:30',
      estLu: false,
    },
    {
      id: 'PROCONNECT',
      expediteur: {
        nom: 'ProConnect',
        mail: 'notifications@proconnect.gouv.fr',
      },
      destinataire: 'vous@votreorganisation.fr',
      objet: 'Nouvelle connexion détectée avec ProConnect',
      heuresMinutesRéception: '09:14',
      estLu: false,
    },
    {
      id: 'INPI',
      expediteur: {
        nom: 'INPI',
        mail: 'noreply@inpi.fr',
      },
      destinataire: 'contact@votreentreprise.fr',
      objet: 'Votre formalité a été transmise aux organismes destinataires',
      heuresMinutesRéception: '09:15',
      estLu: false,
    },
    {
      id: 'CPF',
      expediteur: {
        nom: 'Mon Compte Formation',
        mail: 'cpf-droits@moncompteformation-securite.net',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Vos droits CPF vont expirer – Sécurisez-les avant le 30/09',
      heuresMinutesRéception: '10:05',
      estLu: true,
    },
    {
      id: 'LA_POSTE',
      expediteur: {
        nom: 'La Poste - Colisimo',
        mail: 'laposte@notifications.laposte.fr',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Votre colis arrive !',
      heuresMinutesRéception: '10:50',
      estLu: true,
    },
    {
      id: 'AMENDES.GOUV',
      expediteur: {
        nom: 'amendes.gouv.fr - Trésor Public',
        mail: 'recouvrement@amendes-gouv-huissier.com',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Avis de contravention n°AM-664821 - À retourner sous 5 jours',
      heuresMinutesRéception: '12:10',
      estLu: true,
    },
    {
      id: 'ORANGE',
      expediteur: {
        nom: 'Orange - Service Mobile',
        mail: 'portabilite@orange-mobile-service.com',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Une demande de portabilité de votre numéro a été initiée',
      heuresMinutesRéception: '14:02',
      estLu: true,
    },
    {
      id: 'BANQUE_POSTALE',
      expediteur: {
        nom: 'La Banque Postale',
        mail: 'vous@votreadresse.fr',
      },
      destinataire: 'vous@votreadresse.fr',
      objet: 'Votre relevé de compte de septembre est disponible',
      heuresMinutesRéception: '16:40',
      estLu: true,
    },
    {
      id: 'ANSSI',
      expediteur: {
        nom: 'ANSSI - CERT-FR',
        mail: 'alerte-cert@anssi-gouv-fr.net',
      },
      destinataire: 'rssi@votreentreprise.fr',
      objet: 'Votre relevé de compte de septembre est disponible',
      heuresMinutesRéception: '16:40',
      estLu: true,
    },
  ];

  let mailOuvert: MailHameçonnage | undefined = $state();
</script>

{#snippet boiteMail()}
  <div class="boite-mail">
    <div class="entete">
      <h2 class="fr-h3">Ma boîte mail</h2>
      <div class="champ-recherche">
        <lab-anssi-icone nom="search-line" taille="sm"></lab-anssi-icone>
        <input name="recherche-email" placeholder="Chercher votre mail" />
      </div>
    </div>
    <div class="mails">
      {#each mails as mail (mail.id)}
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
                surClic={() => (mailOuvert = mail)}
              />
            {:else}
              <img src="/assets/icones/coche-verte.svg" alt="Bonne réponse" />
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet panneauLatéral()}
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
        Ouvrez un à un les emails et tentez de determinez lesquels sont légitimes et lesquels ne le sont pas
      </p>
    </div>
  </aside>
{/snippet}

{#snippet mail()}
  <div class="mail-ouvert">
    <div class="entete-mail">
      <h2 class="fr-h6">
        Anomalie critique détectée sur votre compteur professionnel - Intervention à programmer sous 24h
      </h2>
      <p class="texte-mention-xs">
        {Intl.DateTimeFormat('fr-FR').format(new Date())}
        {mailOuvert?.heuresMinutesRéception}
      </p>
      <div class="mail-info">
        <p>de&nbsp;:</p>
        <p><strong>{mailOuvert?.expediteur.nom}</strong>&nbsp;&lt;{mailOuvert?.expediteur?.mail}&gt;</p>
      </div>
      <div class="mail-info">
        <p>à&nbsp;:</p>
        <p>{mailOuvert?.destinataire}</p>
      </div>
    </div>
  </div>
{/snippet}

<dsfr-container>
  <FilAriane
    segments={fabriqueFilAriane({
      feuille: 'Hameçonnage : saurez-vous distinguer le mail légitime du faux&nbsp;?',
      branche: { nom: 'Faire le test !', lien: '/faire-le-test' },
    })}
  />
  <h1 class="fr-h6">Hameçonnage&nbsp;: saurez-vous distinguer le mail légitime du faux&nbsp;?</h1>
  <div class="conteneur">
    {@render panneauLatéral()}
    {#if mailOuvert}
      {@render mail()}
    {:else}
      {@render boiteMail()}
    {/if}
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  dsfr-container {
    background-color: var(--background-alt-blue-france);
    display: flex;
    flex-direction: column;
    padding-bottom: 1.5rem;
  }

  .conteneur {
    @include a-partir-de(lg) {
      display: flex;
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: 1.5rem;
    }
  }

  h1 {
    text-align: center;
    margin-bottom: 1rem;
    @include a-partir-de(sm) {
      text-align: left;
    }
    @include a-partir-de(lg) {
      margin-bottom: 2.5rem;
    }
  }

  aside {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(4);
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
        box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);

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

  .mail-ouvert {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
    display: flex;
    flex-direction: column;
    font-family: Roboto, serif;
    .entete-mail {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 1rem;
      overflow: hidden;

      h2 {
        margin: 0;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
      }
      p {
        margin: 0;
        text-align: start;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mail-info {
        display: grid;
        grid-template-columns: 4rem 1fr;
        width: 100%;
      }
    }
  }
</style>
