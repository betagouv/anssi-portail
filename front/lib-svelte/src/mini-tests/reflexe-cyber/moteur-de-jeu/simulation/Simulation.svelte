<script lang="ts">
  import axios from 'axios';
  import { cubicInOut, cubicOut } from 'svelte/easing';
  import { prefersReducedMotion, Tween } from 'svelte/motion';
  import { fly } from 'svelte/transition';
  import { v7 as uuidv7 } from 'uuid';
  import { rôleParId, type IdRôle, type Rôle } from '../roles';
  import type { Scénario } from '../scenarios';
  import Evenement from './Evenement.svelte';
  import { évènementsParScénario, type Évènement } from './evenements';
  import Messages from './Messages.svelte';
  import Progression from './Progression.svelte';
  import { réflexesParRôle, type Réflexe } from './reflexes';

  type Props = {
    scénario: Scénario;
    rôle: Rôle;
    score: boolean[];
    surSimulationTerminée: () => void;
  };

  const { scénario, rôle, score, surSimulationTerminée }: Props = $props();

  const idCorrélation = uuidv7();

  let évènementsDuScénario: Évènement[] = $derived(évènementsParScénario[scénario.id]);
  let réflexesDuRôle: Réflexe[] = $derived(réflexesParRôle[rôle.id]);

  const nombreÉvènementsTotaux: number = $derived(évènementsDuScénario.length);
  let numéroÉvènementCourant: number = $state(1);

  let évènementCourant: Évènement = $derived(évènementsDuScénario[numéroÉvènementCourant - 1]);
  let réflexeCourant: Réflexe = $derived(réflexesDuRôle[numéroÉvènementCourant - 1]);
  const valeurBlocage = new Tween(0, {
    duration: 1000,
    easing: cubicOut,
  });

  let choixEnCours = $state(false);
  let contenuÉvènement = $state<HTMLElement>();
  let distanceDéfilement = $state(0);

  const passeÉvènementSuivant = () => {
    if (numéroÉvènementCourant < nombreÉvènementsTotaux) {
      distanceDéfilement = contenuÉvènement?.offsetHeight ?? 0;
      valeurBlocage.target = scénario.métrique.bloquage[numéroÉvènementCourant];
      numéroÉvènementCourant++;
    } else {
      surSimulationTerminée();
    }
  };
  const notificationsÀAfficher = $derived(
    (Object.keys(évènementCourant.notifications) as IdRôle[])
      .filter((idRôle) => idRôle !== rôle.id)
      .map((idRôle) => ({
        rôle: rôleParId(idRôle),
        message: évènementCourant.notifications[idRôle],
      }))
  );

  const prendEnCompteRéflexe = async (réflexe: 'bon' | 'mauvais' | 'aucun'): Promise<void> => {
    score.push(réflexe === 'bon');
    await axios.post('/api/mini-tests/reflexes-cyber/reponses', {
      idCorrélation,
      idScénario: scénario.id,
      idRôle: rôle.id,
      numéroÉvènement: numéroÉvènementCourant,
      réflexe,
    });
  };

  const aEuUnBonRéflexe = async () => await prendEnCompteRéflexe('bon');
  const aEuUnMauvaisRéflexe = async () => await prendEnCompteRéflexe('mauvais');
  const aLaisséPasserLeTemps = async () => await prendEnCompteRéflexe('aucun');

  $effect(() => {
    let incrémentation: ReturnType<typeof setInterval> | undefined;
    if (numéroÉvènementCourant === 1 && choixEnCours) {
      valeurBlocage.target = scénario.métrique.bloquage[0];
    }
    if (choixEnCours) {
      const borneSupérieure = scénario.métrique.bloquage[numéroÉvènementCourant] ?? Number.POSITIVE_INFINITY;

      incrémentation = setInterval(() => {
        const incrémentAléatoire = Math.floor(Math.random() * 4) + 1;
        valeurBlocage.target = Math.min(valeurBlocage.target + incrémentAléatoire, borneSupérieure);
      }, 2000);
    }

    return () => clearInterval(incrémentation);
  });
</script>

<dsfr-container class="simulation-contenu">
  <div class="alerte-mobile">
    <dsfr-alert type="info" size="sm" hasTitle={false} dismissible>
      <p slot="description">
        Expérimentez une simulation plus immersive sur ordinateur. Messages en directs, effets sonores...
      </p>
    </dsfr-alert>
  </div>

  <Progression {nombreÉvènementsTotaux} {numéroÉvènementCourant} />

  <div class="grille-simulation">
    <div class="défilement-évènements">
      {#key évènementCourant}
        <section
          class="evenement"
          bind:this={contenuÉvènement}
          aria-labelledby="titre-evenement"
          in:fly={{
            y: distanceDéfilement,
            opacity: 1,
            duration: prefersReducedMotion.current ? 0 : 750,
            easing: cubicInOut,
          }}
          out:fly={{
            y: -distanceDéfilement,
            opacity: 1,
            duration: prefersReducedMotion.current ? 0 : 750,
            easing: cubicInOut,
          }}
        >
          <div class="media" aria-hidden="true">
            <img src={`/assets/images/mini-tests/reflexe-cyber/evenement-${numéroÉvènementCourant}.avif`} alt="" />
          </div>

          <div class="contenu-evenement">
            <Evenement
              dernierÉvènement={numéroÉvènementCourant === 6}
              {rôle}
              évènement={évènementCourant}
              réflexe={réflexeCourant}
              bind:choixEnCours
              surBonRéflexe={aEuUnBonRéflexe}
              surMauvaisRéflexe={aEuUnMauvaisRéflexe}
              surÉvènementSuivant={passeÉvènementSuivant}
              surTempsÉcoulé={aLaisséPasserLeTemps}
            />
          </div>
        </section>
      {/key}
    </div>

    <aside class="indicateur-crise" aria-label="État de la crise">
      <div class="metriques-bloquees">
        <p class="texte-mention-xs">
          {scénario.métrique.label}
        </p>
        <lab-anssi-icone nom="error-warning-line" taille="lg"></lab-anssi-icone>
        <strong class="fr-h4">{Math.round(valeurBlocage.current)}</strong>
      </div>
      <Messages messagesÀAfficher={notificationsÀAfficher} défilementActif={choixEnCours} />
    </aside>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../../../../assets/styles/responsive' as *;

  dsfr-container {
    padding-bottom: 6rem;

    .alerte-mobile {
      margin-bottom: 0;

      @include a-partir-de(md) {
        display: none;
      }
    }

    .grille-simulation {
      display: grid;
      gap: 1.5rem;
      padding-top: 1.5rem;

      @include a-partir-de(md) {
        grid-template-columns: 8fr 4fr;
        gap: 0.625rem;
      }

      @include a-partir-de(xl) {
        grid-template-columns: 9fr 3fr;
        gap: 1.5rem;
      }

      .défilement-évènements {
        display: grid;
        min-width: 0;
        overflow: hidden;

        .evenement {
          display: grid;
          grid-area: 1 / 1;
          min-width: 0;

          @include a-partir-de(xl) {
            grid-template-columns: 1fr 2fr;
            gap: 1.5rem;
          }

          .media {
            display: none;
            padding-right: 1rem;

            @include a-partir-de(xl) {
              display: block;
            }

            img {
              display: block;
              width: 100%;
              aspect-ratio: 266 / 354;
              object-fit: contain;
            }
          }

          .contenu-evenement {
            display: flex;
            min-width: 0;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
        }
      }

      .indicateur-crise {
        position: sticky;
        top: 2.5rem;
        display: none;
        align-self: start;
        box-sizing: border-box;
        padding-left: 1.5rem;

        @include a-partir-de(md) {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .metriques-bloquees {
          padding: 1rem;
          color: var(--text-default-warning);
          background-color: var(--background-contrast-warning);
          display: grid;
          grid-template-columns: 1fr auto;
          grid-column-gap: 1rem;

          p {
            margin: 0;
            color: inherit;
            font-weight: 700;
            text-transform: uppercase;
          }

          strong {
            margin: 0;
            color: inherit;
          }

          lab-anssi-icone {
            grid-row: 1 / span 2;
            grid-column: 2;
          }
        }
      }
    }

    dsfr-alert {
      width: 100%;
    }
  }
</style>
