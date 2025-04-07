<script lang="ts">
  import ChampTexte from '../ui/ChampTexte.svelte';
  import Bouton from '../ui/Bouton.svelte';
  import axios from 'axios';
  import Icone from '../ui/Icone.svelte';
  import ChampRecherche from '../ui/ChampRecherche.svelte';

  let entite: string;
  let email: string;
  let estEnRelationAvecUnUtilisateur: boolean;
  let emailUtilisateur: string;
  let cguSontValidees: boolean;
  let enCoursEnvoi = false;

  const soumetFormulaire = () => {
    enCoursEnvoi = true;
    try {
      axios.post('/api/mon-aide-cyber/demandes-aide', { email });
    } finally {
      enCoursEnvoi = false;
    }
  };
</script>

<article class="page-demande-aide-mon-aide-cyber">
  <section class="encart-presentation">
    <div class="contenu-section">
      <a href="/" class="lien"><Icone type="fleche-gauche" />Retour</a>
    </div>
    <div class="contenu-section grille-deux-colonnes">
      <div>
        <h2>
          Vous souhaitez vous protéger contre les cyberattaques mais ne savez
          pas comment vous y prendre ?
        </h2>
        <p>
          <b>Prenez votre cyberpdépart !</b> Bénéficiez d’un
          <b
            >premier diagnostic gratuit accompagné d’un Aidant de la communauté
            MonAideCyber</b
          >
          et commencez à renforcer rapidement le niveau de cybersécurité de votre
          organisation.
        </p>
        <div class="zone-tags">
          <span class="tag">
            <Icone type="check" /> Dans vos locaux
          </span>
          <span class="tag">
            <Icone type="check" />
            Rapide (1h30)</span
          >
          <span class="tag"> <Icone type="check" /> Anonyme</span>
        </div>
        <p>
          <i
            >Ce diagnostic proposé par l'État n'est pas adapté aux particuliers
            et micro-entreprises.</i
          >
        </p>
      </div>
      <img
        class="illustration dragon-cyberdepart"
        src="/assets/images/illustration-cyberdepart.svg"
        alt="Illustration Cyberdepart"
      />
    </div>
  </section>
  <section class="contenu-section zone-formulaire">
    <div class="carte-formulaire">
      <div class="champ">
        <label class="libelle" for="entite">Recherchez votre organisation</label
        >
        <ChampRecherche bind:recherche={entite} />
        {#if entite}
          <div>Adresse : {entite}</div>
        {/if}
      </div>

      {#if entite}
        <div class="champ">
          <label for="email">*Email de contact</label>
          <ChampTexte
            bind:valeur={email}
            nom="email"
            id="email"
            aideSaisie="Ex: jean.dupont@email.com"
          />
        </div>

        <div class="champ champ-radios">
          <span>
            * Êtes-vous déjà en contact avec un Aidant cyber ou un prestataire ?
          </span>
          <div>
            <label>
              <input
                type="radio"
                bind:group={estEnRelationAvecUnUtilisateur}
                value={false}
              />
              <span>Non</span>
            </label>
            <label>
              <input
                type="radio"
                bind:group={estEnRelationAvecUnUtilisateur}
                value={true}
              />
              <span>Oui</span>
            </label>
          </div>
        </div>

        {#if estEnRelationAvecUnUtilisateur}
          <div class="champ">
            <label for="emailUtilisateur"
              >Email de l'Aidant ou du prestataire</label
            >
            <ChampTexte
              bind:valeur={emailUtilisateur}
              nom="emailUtilisateur"
              id="emailUtilisateur"
              aideSaisie="Ex: jean.dupont@email.com"
            />
          </div>
        {/if}

        <label>
          <input type="checkbox" value="Valide" bind:group={cguSontValidees} />
          <span
            >J'accepte les conditions générales d'utilisation de
            MesServicesCyber au nom de l’entité que je représente.</span
          >
        </label>

        <Bouton
          type="primaire"
          titre="Envoyer ma demande de diagnostic"
          actif={!!entite && !!email && cguSontValidees}
          on:click={soumetFormulaire}
          {enCoursEnvoi}
        />
      {/if}
    </div>
  </section>
</article>

<style lang="scss">
  .page-demande-aide-mon-aide-cyber {
    h2 {
      font-size: 28px;
      font-style: normal;
      font-weight: 700;
      line-height: var(--Typographie-Titres-H2---LG-Interlignage, 36px);
    }

    p {
      font-size: 18px;
      font-style: normal;
      line-height: 28px;
    }

    .encart-presentation {
      padding: var(--gouttiere);

      background-color: var(--controle-segmente-courant-fond);

      .grille-deux-colonnes {
        display: grid;
        grid-template-columns: 1fr;

        .dragon-cyberdepart {
          display: none;
        }
        img {
          overflow: auto;
        }
      }
    }

    .zone-formulaire {
      width: auto;
      max-width: 100%;
      padding: var(--gouttiere);

      .carte-formulaire {
        max-width: 100%;
        border-radius: 8px;
        border: 1px solid
          var(--Couleurs-Clair-Decisions-Border-_border-default-grey, #ddd);
        background: #fff;
        padding: 48px 24px 72px 24px;

        display: flex;
        flex-direction: column;
        gap: 32px;

        .libelle {
          font-size: 20px;
          font-weight: bold;
        }

        .champ {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .champ.champ-radios {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      }
    }
  }

  .zone-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  span.tag {
    background: var(--jaune-jaune-primaire, #fed980);
    color: var(--noir);
    font-weight: 700;
    border-radius: 999px;
    padding: 4px 12px;

    display: flex;
    align-items: center;
    gap: 4px;
  }

  input[type='checkbox'] {
    appearance: none;
    border: 1px solid var(--noir);
    border-radius: 4px;
    width: 24px;
    height: 24px;
    margin: 0;
    cursor: pointer;

    &:checked {
      background-color: var(--jaune-msc);

      &::before {
        content: '';
        display: block;
        margin: auto;
        width: 6px;
        height: 12px;
        border-right: 2px var(--noir) solid;
        border-bottom: 2px var(--noir) solid;
        transform: translateY(2px) rotate(0.12turn);
      }
    }

    &:indeterminate {
      /* Ce style est prévu pour être cumulatif avec l'état coché */
      &::before {
        width: 9px;
        height: 10px;
        border-right: none;
        transform: none;
      }
    }
  }
</style>
