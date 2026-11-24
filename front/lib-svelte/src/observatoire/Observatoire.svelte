<script lang="ts">
  import { onMount } from 'svelte';
  import CarteDonnees from '../graphiques/CarteDonnees.svelte';
  import '../graphiques/dsfrChart';
  import GraphiqueCirculaire from '../graphiques/GraphiqueCirculaire.svelte';
  import GraphiqueLineaire from '../graphiques/GraphiqueLineaire.svelte';
  import NavigationTertiaire from '../navigation/NavigationTertiaire.svelte';
  import {
    récupèreDonnéesObservatoire,
    type ChiffreCléMenaceCyber,
    type DonnéesObservatoire,
    type PointMensuel,
  } from '../passerelles/observatoire';
  import { formateDate, formateNombre, libelleDuMois } from './formatage';

  const onglets = [
    { label: 'Menace cyber', fragment: '#menace-cyber' },
    { label: 'Organisations', fragment: '#organisations' },
    { label: 'Projets', fragment: '#projets' },
  ];
  let ongletActif = $state('#menace-cyber');

  let données: DonnéesObservatoire | undefined = $state();
  let enErreur = $state(false);

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

{#snippet evolution(
  id: string,
  série: PointMensuel[],
  libellé: string,
  infobulle: string,
  source: string,
  date: Date | null
)}
  <CarteDonnees
    {id}
    titre="Évolution par mois (cumul)"
    {infobulle}
    {source}
    date={date ? formateDate(date) : undefined}
    tableau={enTableau(série, libellé)}
  >
    <GraphiqueLineaire
      x={série.map((point) => libelleDuMois(point.mois))}
      y={série.map((point) => point.valeur)}
      nom={libellé}
      unite={libellé}
    />
  </CarteDonnees>
{/snippet}

{#snippet chiffreCle(id: string, titre: string, valeur: number, infobulle: string, source: string, date: Date | null)}
  <CarteDonnees {id} {titre} {infobulle} {source} date={date ? formateDate(date) : undefined}>
    <p class="chiffre-cle">{formateNombre(valeur)}</p>
  </CarteDonnees>
{/snippet}

{#snippet chiffreMenace(
  id: string,
  titre: string,
  description: string,
  infobulle: string,
  chiffre: ChiffreCléMenaceCyber
)}
  <CarteDonnees
    {id}
    {titre}
    {description}
    {infobulle}
    source={chiffre.source}
    date={chiffre.date ? formateDate(chiffre.date) : undefined}
  >
    <p class="chiffre-cle">{chiffre.total}</p>
  </CarteDonnees>
{/snippet}

{#snippet étatDuChargement()}
  {#if enErreur}
    <p class="message" role="alert">
      Les données de l’observatoire sont momentanément indisponibles. Veuillez réessayer plus tard.
    </p>
  {:else}
    <p class="message" role="status">Chargement des données…</p>
  {/if}
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
          {@const niveaux = données.projets.services.parNiveauSecurite}
          <div class="rangee">
            {@render chiffreCle(
              'systemes-securises',
              'Systèmes d’information sécurisés',
              données.projets.services.total,
              'Nombre de systèmes d’information déclarés dans MonServiceSécurisé.',
              données.projets.services.source,
              données.projets.services.date
            )}
            {@render evolution(
              'evolution-systemes-securises',
              données.projets.services.cumulMensuel,
              'SI sécurisés',
              'Évolution du nombre de systèmes d’information déclarés dans MonServiceSécurisé.',
              données.projets.services.source,
              données.projets.services.date
            )}
          </div>

          <div class="rangee pleine-largeur">
            <CarteDonnees
              id="repartition-besoins-securite"
              titre="Répartition par besoins de sécurité des projets"
              infobulle="Répartition des systèmes selon leur sensibilité&nbsp;: «&nbsp;Élémentaires&nbsp;», «&nbsp;Modérés&nbsp;» ou «&nbsp;Importants&nbsp;». Plus le besoin est important, plus les mesures de sécurité demandées sont nombreuses."
              source={données.projets.services.source}
              date={données.projets.services.date ? formateDate(données.projets.services.date) : undefined}
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
              dernièreValeur(données.projets.mesuresFaites.parMois),
              'Nombre de mesures de sécurité mises en œuvre pour sécuriser les systèmes d’information.',
              données.projets.mesuresFaites.source,
              données.projets.mesuresFaites.date
            )}
            {@render evolution(
              'evolution-faiblesses-corrigees',
              données.projets.mesuresFaites.parMois,
              'Mesures faites',
              'Évolution du nombre de mesures de sécurité mises en œuvre pour sécuriser les systèmes d’information.',
              données.projets.mesuresFaites.source,
              données.projets.mesuresFaites.date
            )}
          </div>

          <div class="rangee">
            {@render chiffreCle(
              'homologations-realisees',
              'Homologations réalisées',
              dernièreValeur(données.projets.homologations.cumulMensuel),
              'Nombre d’homologations de systèmes d’information réalisées avec MonServiceSécurisé.',
              données.projets.homologations.source,
              données.projets.homologations.date
            )}
            {@render evolution(
              'evolution-homologations-realisees',
              données.projets.homologations.cumulMensuel,
              'Homologations',
              'Évolution du nombre d’homologations de systèmes d’information réalisées avec MonServiceSécurisé.',
              données.projets.homologations.source,
              données.projets.homologations.date
            )}
          </div>
        {:else}
          {@render étatDuChargement()}
        {/if}
      </section>
    {:else if ongletActif === '#menace-cyber'}
      <section>
        <h2>La menace cyber</h2>
        <p class="introduction">
          Les chiffres clés de la cybermenace en 2025, issus du Panorama de l’ANSSI et des demandes d’assistance reçues
          par Cybermalveillance.gouv.fr. Ils reflètent les signalements reçus et ne sont pas forcément représentatifs de
          l’ensemble des incidents en France.
        </p>

        {#if données}
          {@const menace = données.menaceCyber}
          <h3>Signalements reçus par l’ANSSI</h3>
          <p class="sous-titre">Nombre de signalements reçus et d’incidents avérés en 2025.</p>
          <div class="chiffres-cles par-deux">
            {@render chiffreMenace(
              'evenements-securite',
              'Événements de sécurité traités',
              'Signalements reçus et traités par l’ANSSI en 2025',
              'Nombre d’événements de sécurité portés à la connaissance de l’ANSSI et traités par ses équipes en 2025. Ils regroupent des signalements (comportements anormaux pouvant avoir un caractère malveillant) et des incidents (attaques dont l’ANSSI a confirmé la réussite). Tous ne correspondent donc pas à des attaques abouties.',
              menace.evenementsSecurite
            )}
            {@render chiffreMenace(
              'incidents-averes',
              'Incidents avérés',
              'Événements confirmés comme attaques réussies en 2025',
              'Parmi les événements traités, ceux où l’attaque a réellement réussi : un acteur malveillant a pu agir sur le système informatique de la victime.',
              menace.incidents
            )}
          </div>

          <h3>Tendances de la cybermenace</h3>
          <p class="sous-titre">Tendances clés de la cybermenace observées en 2025.</p>
          <div class="chiffres-cles par-quatre">
            {@render chiffreMenace(
              'rancongiciel',
              'Rançongiciel',
              'Part des TPE, PME et ETI parmi les victimes de rançongiciels en 2025',
              'Selon l’ANSSI, les rançongiciels restent une menace importante en France : 128 compromissions ont été recensées en 2025. Toutes les organisations peuvent être touchées : près de la moitié des victimes sont des TPE, PME ou ETI, aux côtés des collectivités, des établissements de santé et d’enseignement. Les attaquants chiffrent les systèmes et volent souvent des données pour exiger une rançon. Les accès distants gérés par des prestataires ou sous-traitants peuvent servir de porte d’entrée, avec un risque d’arrêt d’activité.',
              menace.rançongiciels
            )}
            {@render chiffreMenace(
              'fraude-virement',
              'Fraude au virement',
              'Hausse des fraudes au virement constatées en 2025 (faux RIB, faux ordres de virement)',
              'Les fraudes au virement ont bondi de +170 % en 2025 selon Cybermalveillance.gouv.fr : usurpation d’un fournisseur ou d’un dirigeant, souvent après piratage d’une messagerie, pour détourner un paiement. Les données bancaires ayant fait l’objet de violations récentes et exposées concourent à ce risque. Pour les entreprises, elle est l’une des cybermenaces les plus fréquentes constatées en 2025 (+93 %).',
              menace.fraudesVirement
            )}
            {@render chiffreMenace(
              'cyberharcelement',
              'Cyberharcèlement',
              'Hausse des cas visant les entreprises en 2025 (dénigrement, faux avis, usurpation d’identité)',
              'Le cyberharcèlement des organisations progresse fortement en 2025 selon Cybermalveillance.gouv.fr, visant autant les dirigeants ou agents que la structure elle-même. Une augmentation de +205 % pour les entreprises a été constatée. Une forte présence en ligne y expose davantage : faux avis, dénigrement organisé, parfois assortis d’une demande de rançon pour leur retrait.',
              menace.cyberharcèlements
            )}
            {@render chiffreMenace(
              'vols-donnees',
              'Vols de données',
              'Progression des incidents liés à l’exfiltration de données en 2025',
              'En 2025, l’ANSSI a constaté, sur la base des signalements reçus, une forte progression des incidents liés à l’exfiltration de données (environ 51 %).',
              menace.volsDonnées
            )}
          </div>
        {:else}
          {@render étatDuChargement()}
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

    h3 {
      color: var(--text-title-grey);
      font-size: 1.25rem;
      line-height: 1.75rem;
      font-weight: bold;
      margin: 1.5rem 0 0.25rem;
    }

    .sous-titre {
      color: var(--text-mention-grey);
      font-size: 0.875rem;
      line-height: 1.5rem;
    }

    .chiffres-cles {
      display: grid;
      gap: 1.5rem;
      margin-top: 1.5rem;

      @include a-partir-de(sm) {
        grid-template-columns: repeat(2, 1fr);
      }

      &.par-quatre {
        @include a-partir-de(lg) {
          grid-template-columns: repeat(4, 1fr);
        }
      }
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
