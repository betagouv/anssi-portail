<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import RetourUtilisateurSurContenu from '../ui/RetourUtilisateurSurContenu.svelte';
  import IllustrationHerosKitSensibilisation from './animation/IllustrationHerosKitSensibilisation.svelte';

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Kit de sensibilisation interne' };

  const thématiques: { titre: string; cheminAperçu: string; titreEmail: string; description: string }[] = [
    {
      titre: '1. Sécurité des comptes',
      cheminAperçu: 'securite-des-comptes.avif',
      titreEmail: 'Votre mot de passe peut devenir un point d’entrée pour une attaque.',
      description:
        'Des supports pour sensibiliser aux bonnes pratiques de protection des comptes, des mots de passe et des identifiants professionnels.',
    },
    {
      titre: '2. Authentification et accès',
      cheminAperçu: 'authentification-et-acces.avif',
      titreEmail: 'Votre mot de passe suffit-il vraiment à vous protéger\u00a0?',
      description:
        'Des modèles pour communiquer sur les bonnes pratiques d’authentification, la gestion des accès et la protection des comptes à privilèges.',
    },
    {
      titre: '3. Hameçonnage',
      cheminAperçu: 'hameconnage.avif',
      titreEmail: 'Ce message a l’air normal. Il ne l’est peut-être pas.',
      description:
        'Des supports pour sensibiliser aux principales formes de phishing et de messages malveillants, et rappeler les bons réflexes face à un contenu suspect.',
    },
    {
      titre: '4. Données sensibles',
      cheminAperçu: 'donnees-sensibles.avif',
      titreEmail: 'Où finissent vraiment les documents que vous partagez\u00a0?',
      description:
        'Des modèles pour sensibiliser à l’identification, la manipulation, le stockage et le partage sécurisé des données sensibles et confidentielles. ',
    },
    {
      titre: '5. Mobilité et déplacement',
      cheminAperçu: 'mobilite-et-deplacement.avif',
      titreEmail: 'Vos données voyagent avec vous. Les protégez-vous\u00a0?',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at dignissim nunc. Maecenas imperdiet molestie dui.',
    },
    {
      titre: '6. Réagir face à un incident',
      cheminAperçu: 'reagir-face-a-un-incident.avif',
      titreEmail: 'Un incident cyber\u00a0? Voici exactement quoi faire.',
      description:
        'Des modèles pour expliquer aux collaborateurs comment reconnaître un incident, quels premiers réflexes adopter et comment le signaler rapidement aux personnes ou services concernés.',
    },
  ];
</script>

<HerosRiche
  description="Un plan de sensibilisation avec 6 thématiques (affiches et courriels) à déployer au rythme de votre organisation. L’ordre proposé suit une progression logique."
  {propriétésFilAriane}
  titre="Kit de sensibilisation interne"
  variante="bleu-clair"
>
  {#snippet illustration()}
    <IllustrationHerosKitSensibilisation />
  {/snippet}
</HerosRiche>

<dsfr-container>
  <div class="encart">
    <div class="section-gauche">
      <h2 class="fr-h5">6 affiches prêtes à imprimer et des courriels prêts à copier</h2>
      <div class="choix-fichier">
        <p>Ajouter votre logo aux affiches (facultatif)</p>
        <p class="texte-mention-xs">
          Format supportés&nbsp;: JPG, PNG. Poids&nbsp;: 2 Mo max. Traité dans votre navigateur, jamais envoyé.
        </p>
        <input
          type="file"
          id="couverture"
          name="couverture"
          accept="image/jpeg, image/png, image/jpg"
          oninput={() => alert('tip')}
        />
      </div>
      <Bouton icone="download-line" libelle="Télécharger le kit" surClic={() => alert('top')} />
    </div>
    <div class="section-droite">
      <img src="/assets/images/kit-de-sensibilisation/apercu-encart.svg" alt="" />
    </div>
  </div>

  <div class="contenu-kit">
    <h2 class="fr-h4">Contenu du kit</h2>
    <div class="thématiques">
      {#each thématiques as thématique (thématique.titre)}
        <div class="thématique">
          <h3 class="fr-h6">{thématique.titre}</h3>
          <div class="aperçu">
            <img src={`/assets/images/kit-de-sensibilisation/${thématique.cheminAperçu}`} alt="" />
            <div class="email">
              <div class="entête">
                <lab-anssi-icone nom="mail-fill" taille="sm"></lab-anssi-icone>
              </div>
              <div class="corps">
                <p>{thématique.titreEmail}</p>
                <div class="largeur-complète"></div>
                <div class="largeur-complète"></div>
                <div class="demi-largeur"></div>
                <div class="largeur-complète"></div>
                <div class="largeur-complète"></div>
                <div class="largeur-complète"></div>
                <div class="demi-largeur"></div>
              </div>
            </div>
          </div>
          <p class="texte-standard-md">{thématique.description}</p>
        </div>
      {/each}
    </div>
  </div>

  <RetourUtilisateurSurContenu identifiantCible="kit-de-sensibilisation-interne" typeDeRetour="outil">
    <p class="texte-article-lg">Ce contenu vous a-t-il aidé&nbsp;?</p>
  </RetourUtilisateurSurContenu>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  dsfr-container {
    padding-bottom: 3.5rem;

    .encart {
      display: grid;
      width: 100%;
      margin-top: 3rem;
      grid-template-columns: 1fr;

      @include a-partir-de(sm) {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
      }

      border: 1px solid var(--border-default-grey, #ddd);
      background: var(--background-raised-grey, #fff);

      .section-gauche {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        gap: 1.5rem;

        h2 {
          margin-bottom: 0;
        }

        .choix-fichier {
          > :first-child {
            margin: 0 0 0.75rem;
          }
          > :nth-child(2) {
            margin: 0 0 1rem;
          }
        }
      }

      .section-droite {
        display: none;

        @include a-partir-de(sm) {
          display: flex;
          justify-content: center;
          background-color: var(--background-alt-beige-gris-galet, #f9f6f2);
        }
      }
    }

    .contenu-kit {
      margin-top: 2rem;
      margin-bottom: 1rem;

      @include a-partir-de(md) {
        margin-bottom: 2rem;
      }

      h2 {
        margin-bottom: 2rem;
      }

      .thématiques {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        @include a-partir-de(md) {
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        @include a-partir-de(lg) {
          grid-template-columns: repeat(3, 1fr);
        }

        .thématique {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem;

          &:nth-child(1) {
            background-color: var(--background-alt-yellow-moutarde);
            .aperçu > .email > .entête {
              background-color: var(--artwork-motif-yellow-moutarde);
            }
          }
          &:nth-child(2) {
            background-color: var(--background-alt-pink-macaron);
            .aperçu > .email > .entête {
              background-color: var(--artwork-motif-pink-macaron);
            }
          }
          &:nth-child(3) {
            background-color: var(--background-alt-blue-cumulus);
            .aperçu > .email > .entête {
              background-color: var(--artwork-motif-blue-cumulus);
            }
          }
          &:nth-child(4) {
            background-color: var(--background-alt-purple-glycine);
            .aperçu > .email > .entête {
              background-color: var(--artwork-motif-purple-glycine);
            }
          }
          &:nth-child(5) {
            background-color: var(--background-alt-beige-gris-galet);
            .aperçu > .email > .entête {
              background-color: var(--artwork-motif-beige-gris-galet);
            }
          }
          &:nth-child(6) {
            background-color: var(--background-alt-green-bourgeon);
            .aperçu > .email > .entête {
              background-color: var(--artwork-motif-green-bourgeon);
            }
          }

          .aperçu {
            display: flex;
            gap: 1rem;
            align-items: center;
            margin-inline: auto;
            width: 100%;
            max-width: 22rem;

            img {
              object-fit: cover;
              flex: 0.55;
              width: 0;
            }

            .email {
              flex: 0.45;
              width: 0;
              color: var(--text-title-blue-france);

              .entête {
                border-radius: 3.7px 3.7px 0px 0px;
                padding: 0.25rem 0.375rem;

                @include a-partir-de(lg) {
                  padding: 0.375rem 0.5rem;
                }
              }

              .corps {
                border-radius: 0px 0px 3.7px 3.7px;
                padding: 0.375rem 0.5rem 0.5rem 0.5rem;
                background-color: var(--background-default-grey);

                @include a-partir-de(lg) {
                  padding: 0.5rem 0.75rem 0.75rem 0.75rem;
                }

                p {
                  font-weight: bold;
                  font-size: 0.5rem;
                  line-height: normal;
                  padding-bottom: 0.5rem;
                }

                .largeur-complète,
                .demi-largeur {
                  height: 0.375rem;
                  margin-bottom: 0.25rem;
                  border-radius: 999px;
                  background-color: var(--background-contrast-blue-france);
                }

                .demi-largeur {
                  width: 50%;

                  &:nth-child(1 of .demi-largeur) {
                    margin-bottom: 0.75rem;
                  }
                }
              }
            }
          }
        }
      }
    }

    .texte-article-lg {
      font-weight: bold;
      margin-bottom: 1rem;
    }
  }
</style>
