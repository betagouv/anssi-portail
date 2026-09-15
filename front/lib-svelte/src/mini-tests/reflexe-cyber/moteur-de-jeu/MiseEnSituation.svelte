<script lang="ts">
  import { clic } from '../../../directives/actions.svelte';
  import Bouton from '../../../ui/Bouton.svelte';
  import type { Rôle } from '../roles';
  import type { Scénario } from '../scenarios';

  type Props = {
    scénario: Scénario;
    rôle: Rôle;
    surModificationScénario: () => void;
    surModificationRôle: () => void;
    surLancement: () => void;
  };

  const { scénario, rôle, surModificationScénario, surModificationRôle, surLancement }: Props = $props();

  const modifieScénario = (événement: MouseEvent | KeyboardEvent) => {
    événement.preventDefault();
    surModificationScénario();
  };

  const modifieRôle = (événement: MouseEvent | KeyboardEvent) => {
    événement.preventDefault();
    surModificationRôle();
  };
</script>

<dsfr-container>
  <div class="mise-en-situation">
    <div class="entete">
      <h2 class="fr-h2">Mise en situation</h2>
      <div class="tags">
        <dsfr-tag
          label={`Scénario : ${scénario.titre}`}
          type="clickable"
          size="md"
          href="#"
          has-icon
          icon="edit-fill"
          use:clic={modifieScénario}
        ></dsfr-tag>
        <dsfr-tag
          label={`Rôle : ${rôle.nom}`}
          type="clickable"
          size="md"
          href="#"
          has-icon
          icon="edit-fill"
          use:clic={modifieRôle}
        ></dsfr-tag>
      </div>
    </div>

    <dsfr-callout
      text="Ce lundi matin, dernier lundi de février, vous démarrez la réunion de direction hebdomadaire à 9h. Vous ne le savez pas encore, mais la journée ne va pas se dérouler comme prévue..."
      accent="purple-glycine"
    ></dsfr-callout>

    <Bouton libelle="Lancer la simulation" taille="lg" surClic={surLancement} />

    <div class="comment-jouer">
      <h3 class="fr-h6">Comment jouer&nbsp;?</h3>
      <ul>
        <li>
          <strong>6 événements clés&nbsp;:</strong>&nbsp;lisez attentivement chaque situation pour identifier le bon
          réflexe.
        </li>
        <li>
          <strong>30 secondes pour choisir&nbsp;:</strong> passé ce délai, l’absence de réponse compte comme un mauvais réflexe.
        </li>
      </ul>
    </div>
  </div>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-block: 3rem 6rem;
  }

  .mise-en-situation {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    max-width: 36.75rem;
    margin-inline: auto;
  }

  .entete {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;

    h2 {
      margin: 0;
      text-align: center;
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  dsfr-callout,
  .comment-jouer {
    width: 100%;
  }

  .comment-jouer {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    h3,
    ul {
      margin: 0;
    }
  }
</style>
