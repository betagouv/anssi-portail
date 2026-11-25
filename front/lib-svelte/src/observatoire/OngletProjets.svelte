<script lang="ts">
  import CarteDonnees from '../graphiques/CarteDonnees.svelte';
  import GraphiqueCirculaire from '../graphiques/GraphiqueCirculaire.svelte';
  import type { DonnéesObservatoire, PointMensuel } from '../passerelles/observatoire';
  import ChiffreCle from './ChiffreCle.svelte';
  import EtatDuChargement from './EtatDuChargement.svelte';
  import EvolutionMensuelle from './EvolutionMensuelle.svelte';
  import { formateDate, formateNombre } from './formatage';
  import Onglet from './Onglet.svelte';
  import Rangee from './Rangee.svelte';

  interface Props {
    données: DonnéesObservatoire['projets'] | undefined;
    enErreur: boolean;
  }

  let { données, enErreur }: Props = $props();

  const dernièreValeur = (série: PointMensuel[]) => série.at(-1)?.valeur ?? 0;
</script>

<Onglet
  titre="Projets"
  introduction="La sécurisation et l’homologation des systèmes d’information dans le secteur public."
>
  {#if données}
    {@const { services, mesuresFaites, homologations } = données}
    <Rangee>
      <ChiffreCle
        id="systemes-securises"
        titre="Systèmes d’information sécurisés"
        valeur={formateNombre(services.total)}
        infobulle="Nombre de systèmes d’information déclarés dans MonServiceSécurisé."
        source={services.source}
        date={services.date}
      />
      <EvolutionMensuelle
        id="evolution-systemes-securises"
        série={services.cumulMensuel}
        libellé="SI sécurisés"
        infobulle="Évolution du nombre de systèmes d’information déclarés dans MonServiceSécurisé."
        source={services.source}
        date={services.date}
      />
    </Rangee>

    <Rangee pleineLargeur>
      <CarteDonnees
        id="repartition-besoins-securite"
        titre="Répartition par besoins de sécurité des projets"
        infobulle="Répartition des systèmes selon leur sensibilité&nbsp;: «&nbsp;Élémentaires&nbsp;», «&nbsp;Modérés&nbsp;» ou «&nbsp;Importants&nbsp;». Plus le besoin est important, plus les mesures de sécurité demandées sont nombreuses."
        source={services.source}
        date={services.date ? formateDate(services.date) : undefined}
        tableau={{
          colonnes: ['Besoins de sécurité', 'SI sécurisés'],
          lignes: services.parNiveauSecurite.map((niveau) => [niveau.niveauSecurite, formateNombre(niveau.total)]),
        }}
      >
        <div class="graphique-circulaire">
          <GraphiqueCirculaire
            x={services.parNiveauSecurite.map((niveau) => niveau.niveauSecurite)}
            y={services.parNiveauSecurite.map((niveau) => niveau.total)}
            unite="SI sécurisés"
            plein
          />
        </div>
      </CarteDonnees>
    </Rangee>

    <Rangee>
      <ChiffreCle
        id="faiblesses-corrigees"
        titre="Faiblesses corrigées"
        valeur={formateNombre(dernièreValeur(mesuresFaites.parMois))}
        infobulle="Nombre de mesures de sécurité mises en œuvre pour sécuriser les systèmes d’information."
        source={mesuresFaites.source}
        date={mesuresFaites.date}
      />
      <EvolutionMensuelle
        id="evolution-faiblesses-corrigees"
        série={mesuresFaites.parMois}
        libellé="Mesures faites"
        infobulle="Évolution du nombre de mesures de sécurité mises en œuvre pour sécuriser les systèmes d’information."
        source={mesuresFaites.source}
        date={mesuresFaites.date}
      />
    </Rangee>

    <Rangee>
      <ChiffreCle
        id="homologations-realisees"
        titre="Homologations réalisées"
        valeur={formateNombre(dernièreValeur(homologations.cumulMensuel))}
        infobulle="Nombre d’homologations de systèmes d’information réalisées avec MonServiceSécurisé."
        source={homologations.source}
        date={homologations.date}
      />
      <EvolutionMensuelle
        id="evolution-homologations-realisees"
        série={homologations.cumulMensuel}
        libellé="Homologations"
        infobulle="Évolution du nombre d’homologations de systèmes d’information réalisées avec MonServiceSécurisé."
        source={homologations.source}
        date={homologations.date}
      />
    </Rangee>
  {:else}
    <EtatDuChargement {enErreur} />
  {/if}
</Onglet>

<style lang="scss">
  .graphique-circulaire {
    width: 100%;
    max-width: 540px;
    margin: 0 auto;
  }
</style>
