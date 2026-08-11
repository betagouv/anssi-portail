<script lang="ts">
  import axios from 'axios';
  import { derived } from 'svelte/store';
  import { profilStore } from '../stores/profil.store';
  import Lien from '../ui/Lien.svelte';
  import { afficheNouvelleDA } from '$plateforme/environnement';
  import Alternatives from '../ui/Alternatives.svelte';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import { type Props as PropriétésFilAriane } from '../ui/FilAriane.svelte';
  import Bouton from '../ui/Bouton.svelte';

  export let introFaite = false;

  const aDejaUnTest = derived<typeof profilStore, boolean>(
    profilStore,
    ($profilStore, set) => {
      if ($profilStore) {
        axios
          .get('/api/resultats-test/dernier')
          .then(() => set(true))
          .catch(() => set(false));
      }
    },
    false
  );

  function debuteTeste() {
    introFaite = true;
  }

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Test de maturité cyber', fondSombre: false };
</script>

<Alternatives affichageAlternatif={afficheNouvelleDA}>
  {#snippet défaut()}
    <dsfr-container class="test-maturite">
      {#if $aDejaUnTest}
        <Lien href="/ma-maturite" libelle="Retour" icone="arrow-go-back-line" />
      {/if}
      <div class="contenu-test">
        <div class="introduction">
          <h2>Quelle est la maturité cyber de votre organisation&nbsp;?</h2>
          <p>
            La maturité cyber reflète le niveau global de <b>prise en compte des enjeux de cybersécurité</b>
            par une organisation. Répondez à <b>6 questions</b> pour obtenir votre évaluation <b>indicative</b>.
          </p>
          <input type="button" class="bouton primaire taille-moyenne" value="Débuter le test" on:click={debuteTeste} />
          <hr />
          <div class="acces-session-groupe">
            <hgroup>
              <h3 class="fr-h6">
                <lab-anssi-icone taille="md" nom="team-fill"></lab-anssi-icone> Session de groupe
              </h3>
              <p class="texte-standard-md">
                Évaluez de façon indicative la maturité cyber du groupe en comparant anonymement les résultats des
                participants.
              </p>
            </hgroup>
            <Lien
              apparence="bouton"
              libelle="Créer ou rejoindre une session"
              href="/session-groupe"
              type="secondaire"
            />
          </div>
        </div>
        <div class="illustration">
          <img
            src="/assets/images/test-maturite/illustration-prise-en-compte-risque.svg"
            width="432"
            height="324"
            alt=""
          />
        </div>
      </div>
      <div class="note">
        Le résultat obtenu est une évaluation indicative basée sur un modèle élaboré par l’ANSSI. La maturité cyber
        n’est pas une évaluation du niveau de sécurité des systèmes d’information d’une organisation mais de sa posture
        à l’égard des enjeux cyber.
      </div>
    </dsfr-container>
  {/snippet}
  {#snippet alternatif()}
    <HerosRiche
      description="Obtenez en 6 questions une évaluation indicative de la maturité cyber de votre organisation."
      {propriétésFilAriane}
      titre="Quelle est la maturité cyber de votre organisation ?"
      variante="cafe-creme"
      mentionAdditionnelle="Le résultat obtenu est une évaluation indicative basée sur un modèle élaboré par l’ANSSI. La maturité cyber n’est
      pas une évaluation du niveau de sécurité des systèmes d’information d’une organisation mais de sa posture à
      l’égard des enjeux cyber."
      badges={[
        { label: '⏱️ 5 min.', accent: 'purple-glycine' },
        { label: '🔥 +12k organisations ont fait le test', accent: 'purple-glycine' },
      ]}
    >
      {#snippet illustration()}
        <img class="illustration-du-bandeau" src="/assets/images/test-maturite/illustration-introduction.svg" alt="" />
      {/snippet}
      {#snippet actions()}
        <div class="conteneur-actions">
          <Bouton libelle="Débuter le test" type="primaire" surClic={debuteTeste} />
          <Lien href="/session-groupe" icone="team-fill" libelle="Accéder à l’espace session en groupe" />
        </div>
      {/snippet}
    </HerosRiche>
  {/snippet}
</Alternatives>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .illustration-du-bandeau {
    width: 100%;
  }

  .conteneur-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
    @include a-partir-de(lg) {
      gap: 32px;
    }
  }

  .introduction {
    h2 {
      font-size: 1.75rem;
      line-height: 2.25rem;
      font-weight: bold;
      margin: 0 0 24px;

      @include a-partir-de(lg) {
        margin-top: 24px;
      }
      @include a-partir-de(xl) {
        margin-top: 0;
      }
    }

    p {
      font-size: 1.125rem;
      line-height: 1.75rem;
      margin-bottom: 24px;
    }

    .bouton {
      margin: 24px 0 16px;
    }
  }

  hr {
    margin: 40px 0 32px;
    height: 1px;
    border: 0;
    background-color: var(--border-default-grey);
  }

  .acces-session-groupe {
    padding-bottom: 24px;
    hgroup {
      .fr-h6 {
        margin-bottom: 8px;

        lab-anssi-icone {
          margin-right: 8px;
        }
      }

      p {
        color: var(--text-default-grey);
      }
    }
  }
</style>
