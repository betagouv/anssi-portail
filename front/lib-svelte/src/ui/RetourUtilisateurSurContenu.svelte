<script module lang="ts">
  export type TypeDeRetour = TypeDeRetourMiniTests | TypeDeRetourRessourcesIdentifiées;
  export type TypeDeRetourMiniTests = 'test-maturité' | 'vrai-faux' | 'exposition' | 'reflexes-cyber';
  export type TypeDeRetourRessourcesIdentifiées = 'article' | 'mesure' | 'outil';
</script>

<script lang="ts">
  import axios from 'axios';
  import type { Snippet } from 'svelte';
  import Alerte from './Alerte.svelte';
  import Bouton from './Bouton.svelte';
  import {
    ajouteRetour,
    récupèreRetour,
    supprimeRetour,
    type RetourUtilisateur,
  } from './retourUtilisateurSurContenu.store';

  type Props = {
    children?: Snippet;
    mode?: 'carte' | 'page';
  } & (
    | {
        typeDeRetour: TypeDeRetourRessourcesIdentifiées;
        identifiantCible: string;
      }
    | {
        typeDeRetour: TypeDeRetourMiniTests;
        identifiantCible?: never;
      }
  );
  const { typeDeRetour, children, identifiantCible, mode = 'page' }: Props = $props();
  const urlDePost = $derived(
    (
      {
        article: `/api/articles/${identifiantCible}/avis`,
        mesure: `/api/mesures/${identifiantCible}/avis`,
        outil: `/api/outils/retours/${identifiantCible}`,

        exposition: '/api/retour-mini-tests/exposition',
        'reflexes-cyber': '/api/retour-mini-tests/reflexes-cyber',
        'test-maturité': '/api/retour-mini-tests/test-maturité',
        'vrai-faux': '/api/retour-mini-tests/vrai-faux',
      } satisfies { [C in TypeDeRetour]: string }
    )[typeDeRetour]
  );

  const clé = $derived(
    (
      {
        article: `article:${identifiantCible}`,
        mesure: `mesure:${identifiantCible}`,
        outil: `outil:${identifiantCible}`,

        exposition: 'retour-utilisateur:exposition',
        'reflexes-cyber': 'retour-utilisateur:reflexes-cyber',
        'test-maturité': 'resultat-test',
        'vrai-faux': 'retour-utilisateur:vrai-faux',
      } satisfies { [C in TypeDeRetour]: string }
    )[typeDeRetour]
  );

  const retourUtilisateur: RetourUtilisateur | undefined = $derived(clé ? récupèreRetour(clé) : undefined);
  let étatBoutons = $derived(retourUtilisateur?.positif);

  type Etat = 'Soumis' | 'AfficheCommentaire' | undefined;
  let etat = $state<Etat>(undefined);
  let commentaire: string = $state('');

  const soumetsAvisPositif = async () => {
    const retourUtilisateur = récupèreRetour(clé);
    if (retourUtilisateur?.positif === true) {
      étatBoutons = undefined;
      supprimeRetour(clé);
    } else {
      await soumetsAvisUtilisateur(true);
    }
  };

  const soumetsAvisNegatif = async (commentaire: string) => {
    await soumetsAvisUtilisateur(false, commentaire);
  };

  let time: number;
  const soumetsAvisUtilisateur = async (retour: boolean, commentaire?: string) => {
    ajouteRetour(clé, { positif: retour });
    étatBoutons = retour;
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

    const retourUtilisateur = récupèreRetour(clé);
    if (retourUtilisateur?.positif === false) {
      étatBoutons = undefined;
      supprimeRetour(clé);
      etat = undefined;
    } else {
      étatBoutons = false;
      ajouteRetour(clé, { positif: false });
      etat = 'AfficheCommentaire';
    }
  };
</script>

<div class={['section-aide', 'retour', mode]}>
  <div class="texte-information-avis-utilisateur">
    {#if children}
      {@render children()}
    {:else}
      <p class="texte-article-lg">
        <b>Ce contenu vous a-t-il aidé&nbsp;?</b>
      </p>
    {/if}
  </div>
  <div class="conteneur-emoji-avis">
    <Bouton
      type={étatBoutons === true ? 'primaire' : mode === 'page' ? 'tertiaire' : 'tertiaire-sans-bordure'}
      iconeSeule
      icone="thumb-up-line"
      taille={mode === 'page' ? 'md' : 'sm'}
      titre="Réponse positive"
      surClic={() => soumetsAvisPositif()}
    ></Bouton>
    <Bouton
      type={étatBoutons === false ? 'primaire' : mode === 'page' ? 'tertiaire' : 'tertiaire-sans-bordure'}
      iconeSeule
      icone="thumb-down-line"
      taille={mode === 'page' ? 'md' : 'sm'}
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
    <div class="alerte-soumission">
      <Alerte type="succès" taille="sm">Merci&nbsp;! Vos retours sont précieux. ✨</Alerte>
    </div>
  {/if}
</div>

<style lang="scss">
  .section-aide {
    &.carte {
      display: grid;
      grid-template-columns: 1fr auto;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      align-items: center;

      border: 1px solid var(--border-default-grey);
      border-top: 0;

      .encart-commentaire-avis,
      .alerte-soumission {
        grid-column: 1 / -1;
      }

      .texte-information-avis-utilisateur {
        margin-bottom: 0;
      }

      .conteneur-emoji-avis {
        :global(dsfr-button) {
          min-height: initial;
        }
      }
    }

    &.page {
      .texte-information-avis-utilisateur {
        margin-bottom: 1;
      }
    }

    &.retour {
      .texte-information-avis-utilisateur {
        color: var(--text-title-grey);
      }
    }

    .conteneur-emoji-avis {
      display: flex;
      gap: 0.5rem;
    }

    .alerte-soumission,
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
