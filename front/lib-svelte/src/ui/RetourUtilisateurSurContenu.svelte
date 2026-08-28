<script lang="ts">
  import axios from 'axios';
  import { type AvisUtilisateur, storeAvisUtilisateur } from '../parcours-securisation/avisUtilisateur.store';
  import Bouton from './Bouton.svelte';

  type Props = {
    idMesure: string;
  };
  const { idMesure }: Props = $props();

  const avisUtilisateur: AvisUtilisateur | undefined = $derived(idMesure ? $storeAvisUtilisateur[idMesure] : undefined);

  type Etat = 'Soumis' | 'AfficheCommentaire' | undefined;
  let etat = $state<Etat>(undefined);
  let commentaire: string = $state('');

  const soumetsAvisPositif = async () => {
    if (!idMesure) return;
    if ($storeAvisUtilisateur[idMesure]?.positif === true) {
      storeAvisUtilisateur.supprimeAvis(idMesure);
    } else {
      await soumetsAvisUtilisateur(true);
    }
  };

  const soumetsAvisNegatif = async (commentaire: string) => {
    await soumetsAvisUtilisateur(false, commentaire);
  };

  let time: number;
  const soumetsAvisUtilisateur = async (retour: boolean, commentaire?: string) => {
    if (!idMesure) return;
    storeAvisUtilisateur.ajouteAvis(idMesure, { positif: retour });
    await axios.post(`/api/mesures/${idMesure}/avis`, {
      retour: retour ? 'POSITIF' : 'NEGATIF',
      ...(!retour && { commentaire }),
    });
    etat = 'Soumis';
    time = window.setTimeout(() => {
      etat = undefined;
    }, 5000);
  };

  const afficheCommentaire = () => {
    if (!idMesure) return;
    clearTimeout(time);

    if (idMesure in $storeAvisUtilisateur && !$storeAvisUtilisateur[idMesure]) {
      storeAvisUtilisateur.supprimeAvis(idMesure);
      etat = undefined;
    } else {
      storeAvisUtilisateur.ajouteAvis(idMesure, { positif: false });
      etat = 'AfficheCommentaire';
    }
  };
</script>

<div class="section-aide retour">
  <div class="texte-information-avis-utilisateur">
    <span class="titre-avis"><b>Ce contenu vous a-t-il aidé&nbsp;?</b></span>
  </div>
  <div class="conteneur-emoji-avis">
    <Bouton
      type={avisUtilisateur?.positif ? 'primaire' : 'tertiaire'}
      iconeSeule
      icone="thumb-up-line"
      titre="Réponse positive"
      surClic={() => soumetsAvisPositif()}
    ></Bouton>
    <Bouton
      type={avisUtilisateur && !avisUtilisateur.positif ? 'primaire' : 'tertiaire'}
      iconeSeule
      icone="thumb-down-line"
      titre="Réponse négative"
      surClic={() => afficheCommentaire()}
    ></Bouton>
  </div>
  {#if etat === 'AfficheCommentaire'}
    <div class="encart-commentaire-avis">
      <dsfr-textarea
        label="Aidez-nous à améliorer le contenu de cette page"
        placeholder="Indiquez ce qu'il vous a manqué, ce qui n'était pas clair ou ce qui pourrait être amélioré."
        type="text"
        nom="avis"
        rows="1"
        maxlength="1000"
        onvaluechanged={(e: CustomEvent<string>) => {
          commentaire = e.detail;
        }}
      ></dsfr-textarea>
      <div class="conteneur-bouton">
        <Bouton type="primaire" libelle="Envoyer vos commentaires" surClic={() => soumetsAvisNegatif(commentaire)}
        ></Bouton>
      </div>
    </div>
  {/if}
  {#if etat === 'Soumis'}
    <dsfr-alert type="success" size="sm">
      <span slot="description">Merci&nbsp;! Vos retours sont précieux. ✨</span>
    </dsfr-alert>
  {/if}
</div>

<style lang="scss">
  .section-aide {
    margin-bottom: 3rem;

    &.retour .texte-information-avis-utilisateur {
      margin-bottom: 1rem;
      color: var(--text-title-grey);
    }

    dsfr-alert,
    .encart-commentaire-avis {
      margin-top: 1.5rem;
    }

    .encart-commentaire-avis {
      background-color: var(--background-contrast-beige-gris-galet);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.5rem;

      .conteneur-bouton {
        margin-top: 1rem;
      }
    }
  }
</style>
