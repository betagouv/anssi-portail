<script lang="ts">
  import { onMount } from 'svelte';
  import CarteDonnees from '../graphiques/CarteDonnees.svelte';
  import '../graphiques/dsfrChart';
  import GraphiqueCirculaire from '../graphiques/GraphiqueCirculaire.svelte';
  import GraphiqueLineaire from '../graphiques/GraphiqueLineaire.svelte';
  import NavigationTertiaire from '../navigation/NavigationTertiaire.svelte';
  import {
    récupèreDonnéesObservatoire,
    type DonnéesObservatoire,
    type PointMensuel,
  } from '../passerelles/observatoire';
  import { formateDate, formateNombre, libelleDuMois } from './formatage';

  const onglets = [
    { label: 'Menace cyber', fragment: '#menace-cyber' },
    { label: 'Organisations', fragment: '#organisations' },
    { label: 'Projets', fragment: '#projets' },
  ];
  let ongletActif = $state('#projets');

  const source = 'MonServiceSécurisé';

  let données: DonnéesObservatoire | undefined = $state();
  let enErreur = $state(false);

  const date = $derived(données?.dateDerniereMiseAJour ? formateDate(données.dateDerniereMiseAJour) : undefined);

  const dernièreValeur = (série: PointMensuel[]) => série.at(-1)?.valeur ?? 0;
  const enTableau = (série: PointMensuel[], libellé: string) => ({
    colonnes: ['Mois', libellé],
    lignes: série.map((point) => [libelleDuMois(point.mois), formateNombre(point.valeur)]),
  });

  onMount(async () => {
    try {
      données = await récupèreDonnéesObservatoire();
    } catch {
      enErreur = true;
    }
  });
</script>

{#snippet evolution(id: string, série: PointMensuel[], libellé: string, infobulle: string)}
  <CarteDonnees {id} titre="Évolution par mois (cumul)" {infobulle} {source} {date} tableau={enTableau(série, libellé)}>
    <GraphiqueLineaire
      x={série.map((point) => libelleDuMois(point.mois))}
      y={série.map((point) => point.valeur)}
      nom={libellé}
      unite={libellé}
    />
  </CarteDonnees>
{/snippet}

{#snippet chiffreCle(id: string, titre: string, valeur: number, infobulle: string)}
  <CarteDonnees {id} {titre} {infobulle} {source} {date}>
    <p class="chiffre-cle">{formateNombre(valeur)}</p>
  </CarteDonnees>
{/snippet}

<header class="bandeau">
  <dsfr-container>
    <h1>Observatoire de la cybersécurité des organisations</h1>
    <p class="chapo">La menace, la maturité et l’engagement des organisations françaises dans leur sécurisation.</p>
    <p class="mention">
      Les données sont issues des usages de MesServicesCyber, de MonServiceSécurisé et du Panorama de la menace 2025.
    </p>
  </dsfr-container>
</header>

<div class="contenu">
  <dsfr-container>
    <NavigationTertiaire liens={onglets} bind:lienActif={ongletActif} />

    {#if ongletActif === '#projets'}
      <section>
        <h2>Projets</h2>
        <p class="introduction">La sécurisation et l’homologation des systèmes d’information dans le secteur public.</p>

        {#if données}
          {@const niveaux = données.services.parNiveauSecurite}
          <div class="rangee">
            {@render chiffreCle(
              'systemes-securises',
              'Systèmes d’information sécurisés',
              données.services.total,
              'Nombre de systèmes d’information déclarés dans MonServiceSécurisé.'
            )}
            {@render evolution(
              'evolution-systemes-securises',
              données.services.cumulMensuel,
              'SI sécurisés',
              'Évolution du nombre de systèmes d’information déclarés dans MonServiceSécurisé.'
            )}
          </div>

          <div class="rangee pleine-largeur">
            <CarteDonnees
              id="repartition-besoins-securite"
              titre="Répartition par besoins de sécurité des projets"
              infobulle="Répartition des systèmes selon leur sensibilité&nbsp;: «&nbsp;Élémentaires&nbsp;», «&nbsp;Modérés&nbsp;» ou «&nbsp;Importants&nbsp;». Plus le besoin est important, plus les mesures de sécurité demandées sont nombreuses."
              {source}
              {date}
              tableau={{
                colonnes: ['Besoins de sécurité', 'SI sécurisés'],
                lignes: niveaux.map((niveau) => [niveau.niveauSecurite, formateNombre(niveau.total)]),
              }}
            >
              <div class="graphique-circulaire">
                <GraphiqueCirculaire
                  x={niveaux.map((niveau) => niveau.niveauSecurite)}
                  y={niveaux.map((niveau) => niveau.total)}
                  unite="SI sécurisés"
                  plein
                />
              </div>
            </CarteDonnees>
          </div>

          <div class="rangee">
            {@render chiffreCle(
              'faiblesses-corrigees',
              'Faiblesses corrigées',
              dernièreValeur(données.mesuresFaites.parMois),
              'Nombre de mesures de sécurité mises en œuvre pour sécuriser les systèmes d’information.'
            )}
            {@render evolution(
              'evolution-faiblesses-corrigees',
              données.mesuresFaites.parMois,
              'Mesures faites',
              'Évolution du nombre de mesures de sécurité mises en œuvre pour sécuriser les systèmes d’information.'
            )}
          </div>

          <div class="rangee">
            {@render chiffreCle(
              'homologations-realisees',
              'Homologations réalisées',
              dernièreValeur(données.homologations.cumulMensuel),
              'Nombre d’homologations de systèmes d’information réalisées avec MonServiceSécurisé.'
            )}
            {@render evolution(
              'evolution-homologations-realisees',
              données.homologations.cumulMensuel,
              'Homologations',
              'Évolution du nombre d’homologations de systèmes d’information réalisées avec MonServiceSécurisé.'
            )}
          </div>
        {:else if enErreur}
          <p class="message" role="alert">
            Les données de l’observatoire sont momentanément indisponibles. Veuillez réessayer plus tard.
          </p>
        {:else}
          <p class="message" role="status">Chargement des données…</p>
        {/if}
      </section>
    {:else}
      <section>
        <h2>{onglets.find((onglet) => onglet.fragment === ongletActif)?.label}</h2>
        <p class="message">Ces données seront bientôt disponibles.</p>
      </section>
    {/if}
  </dsfr-container>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  p {
    margin: 0;
  }

  .bandeau {
    padding: 3rem 0 2.5rem;
    border-bottom: 1px solid var(--border-default-grey);

    h1 {
      color: var(--text-title-grey);
      font-size: 2rem;
      line-height: 2.5rem;
      font-weight: bold;
      margin: 0 0 0.75rem;

      @include a-partir-de(md) {
        font-size: 2.5rem;
        line-height: 3rem;
      }
    }

    .chapo {
      color: var(--text-default-grey);
      font-size: 1.25rem;
      line-height: 2rem;
      margin-bottom: 0.75rem;
    }

    .mention {
      color: var(--text-default-grey);
      font-size: 0.875rem;
      line-height: 1.5rem;
    }
  }

  .contenu {
    padding: 2rem 0 5rem;
    background: var(--background-alt-grey);

    h2 {
      color: var(--text-title-grey);
      font-size: 2rem;
      line-height: 2.5rem;
      font-weight: bold;
      margin: 0 0 0.75rem;
    }

    .introduction {
      color: var(--text-mention-grey);
      max-width: 736px;
    }

    .rangee {
      display: grid;
      gap: 1.5rem;
      margin-top: 1.5rem;

      @include a-partir-de(md) {
        grid-template-columns: 1fr 2fr;
      }
    }

    .rangee.pleine-largeur {
      grid-template-columns: 1fr;
    }

    .graphique-circulaire {
      width: 100%;
      max-width: 540px;
      margin: 0 auto;
    }

    .message {
      margin-top: 1.5rem;
      color: var(--text-mention-grey);
    }

    section {
      margin-top: 1.5rem;
    }

    .chiffre-cle {
      color: var(--text-title-grey);
      font-size: 2.5rem;
      line-height: 3rem;
      font-weight: bold;
      text-align: center;
      padding: 1rem 0;
    }
  }
</style>
