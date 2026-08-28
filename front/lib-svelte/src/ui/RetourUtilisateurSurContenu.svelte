<script lang="ts">
  import axios from 'axios';
  import { untrack } from 'svelte';
  import Bouton from './Bouton.svelte';
  import { type RetourUtilisateur, storeRetourUtilisateurSurContenu } from './retourUtilisateurSurContenu.store';

  type Props = {
    préfixeDeStockage: string;
    clé: string;
    urlDePost: string;
  };
  const { préfixeDeStockage, clé, urlDePost }: Props = $props();

  const store = storeRetourUtilisateurSurContenu(untrack(() => préfixeDeStockage));
  const avisUtilisateur: RetourUtilisateur | undefined = $derived(clé ? $store[clé] : undefined);

  type Etat = 'Soumis' | 'AfficheCommentaire' | undefined;
  let etat = $state<Etat>(undefined);
  let commentaire: string = $state('');

  const soumetsAvisPositif = async () => {
    if (!store) return;
    if ($store[clé]?.positif === true) {
      store.supprimeAvis(clé);
    } else {
      await soumetsAvisUtilisateur(true);
    }
  };

  const soumetsAvisNegatif = async (commentaire: string) => {
    await soumetsAvisUtilisateur(false, commentaire);
  };

  let time: number;
  const soumetsAvisUtilisateur = async (retour: boolean, commentaire?: string) => {
    storeRetourUtilisateurSurContenu;
    store.ajouteAvis(clé, { positif: retour });
    await axios.post(urlDePost, {
      retour: retour ? 'POSITIF' : 'NEGATIF',
      ...(!retour && { commentaire }),
    });
    etat = 'Soumis';
    time = window.setTimeout(() => {
      etat = undefined;
    }, 5000);
  };

  const afficheCommentaire = () => {
    if (!clé) return;
    clearTimeout(time);

    if (clé in $store && !$store[clé]) {
      store.supprimeAvis(clé);
      etat = undefined;
    } else {
      store.ajouteAvis(clé, { positif: false });
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
