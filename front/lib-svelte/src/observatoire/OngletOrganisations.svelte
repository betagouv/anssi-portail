<script lang="ts">
  import CarteDonnees from '../graphiques/CarteDonnees.svelte';
  import GraphiqueCirculaire from '../graphiques/GraphiqueCirculaire.svelte';
  import type { DonnéesObservatoire } from '../passerelles/observatoire';
  import ChiffreCle from './ChiffreCle.svelte';
  import CompletionNiveauComplet from './CompletionNiveauComplet.svelte';
  import EtatDuChargement from './EtatDuChargement.svelte';
  import EvolutionMensuelle from './EvolutionMensuelle.svelte';
  import { formateDate, formateNombre } from './formatage';
  import Onglet from './Onglet.svelte';
  import Rangee from './Rangee.svelte';
  import RepartitionGeographique from './RepartitionGeographique.svelte';
  import SousSection from './SousSection.svelte';

  interface Props {
    données: DonnéesObservatoire['organisations'] | undefined;
    enErreur: boolean;
  }

  let { données, enErreur }: Props = $props();
</script>

<Onglet
  titre="Organisations"
  introduction="Comment les organisations s’emparent de la cybersécurité&nbsp;: de la découverte du risque avec les tests de sensibilisation cyber jusqu’à la prise en compte des mesures de sécurité."
>
  {#if données}
    {@const {
      testsMaturité,
      testsSensibilisation,
      démarchesInitiées,
      diagnosticsCyberdépart,
      cyberdépartsValidés,
      complétions,
    } = données}
    {@const niveaux = testsMaturité.parNiveau}
    <SousSection
      titre="Baromètre de la maturité cyber"
      description="Répartition de la maturité cyber des organisations sur l’ensemble des tests de maturité réalisés."
    >
      <Rangee>
        <ChiffreCle
          id="tests-maturite-realises"
          titre="Tests de maturité réalisés"
          valeur={formateNombre(testsMaturité.total)}
          infobulle="Nombre de tests de maturité cyber réalisés sur MesServicesCyber."
          source={testsMaturité.source}
          date={testsMaturité.date}
        />
        <CarteDonnees
          id="repartition-niveaux-maturite"
          titre="Répartition par niveau de maturité"
          infobulle="Répartition des tests de maturité cyber réalisés selon le niveau obtenu&nbsp;: «&nbsp;Insuffisant&nbsp;», «&nbsp;Émergent&nbsp;», «&nbsp;Intermédiaire&nbsp;», «&nbsp;Confirmé&nbsp;» ou «&nbsp;Optimal&nbsp;»."
          source={testsMaturité.source}
          date={testsMaturité.date ? formateDate(testsMaturité.date) : undefined}
          tableau={{
            colonnes: ['Niveau de maturité', 'Tests de maturité'],
            lignes: niveaux.map((niveau) => [niveau.niveau, formateNombre(niveau.total)]),
          }}
        >
          <div class="graphique-circulaire">
            <GraphiqueCirculaire
              x={niveaux.map((niveau) => niveau.niveau)}
              y={niveaux.map((niveau) => niveau.total)}
              unite="Tests de maturité"
            />
          </div>
        </CarteDonnees>
      </Rangee>
    </SousSection>

    <SousSection titre="Entités sensibilisées" description="Utilisation des tests de sensibilisation cyber.">
      <Rangee>
        <ChiffreCle
          id="tests-sensibilisation-realises"
          titre="Tests de sensibilisation cyber réalisés"
          valeur={formateNombre(testsSensibilisation.total)}
          infobulle="Nombre de tests de sensibilisation réalisés sur MesServicesCyber (test de maturité, vrai&nbsp;/&nbsp;faux, hameçonnage, etc.)."
          source={testsSensibilisation.source}
          date={testsSensibilisation.date}
        />
        <EvolutionMensuelle
          id="evolution-tests-sensibilisation"
          série={testsSensibilisation.cumulMensuel}
          libellé="Tests de sensibilisation cyber réalisés"
          infobulle="Progression du nombre de tests de sensibilisation cyber réalisés, mois par mois."
          source={testsSensibilisation.source}
          date={testsSensibilisation.date}
        />
      </Rangee>
    </SousSection>

    <SousSection
      titre="Entités passées à l’action"
      description="Organisations ayant démarré au moins une démarche de sécurisation."
    >
      <Rangee colonnesÉgales>
        <ChiffreCle
          id="demarches-initiees"
          titre="Démarches de sécurisation initiées"
          valeur={formateNombre(démarchesInitiées.total)}
          infobulle="Nombre total de démarches de sécurisation engagées par les organisations sur MesServicesCyber (diagnostic et parcours de sécurisation)."
          source={démarchesInitiées.source}
          date={démarchesInitiées.date}
        />
        <ChiffreCle
          id="diagnostics-cyberdepart"
          titre="Diagnostics Cyberdépart réalisés"
          valeur={formateNombre(diagnosticsCyberdépart.total)}
          infobulle="Nombre de diagnostics Cyberdépart réalisés par les organisations sur MesServicesCyber."
          source={diagnosticsCyberdépart.source}
          date={diagnosticsCyberdépart.date}
        />
      </Rangee>
    </SousSection>

    <SousSection
      titre="Engagement dans une démarche de sécurisation"
      description="Organisations ayant démarré au moins une démarche de sécurisation et leur progression."
    >
      <Rangee>
        <ChiffreCle
          id="cyberdeparts-valides"
          titre="Niveau Cyberdépart validé"
          valeur={formateNombre(cyberdépartsValidés.total)}
          infobulle="Nombre d’organisations qui ont validé leur Cyberdépart, c’est-à-dire pris en compte 50&nbsp;% des mesures de sécurité essentielles."
          source={cyberdépartsValidés.source}
          date={cyberdépartsValidés.date}
        />
        <EvolutionMensuelle
          id="evolution-cyberdeparts-valides"
          série={cyberdépartsValidés.cumulMensuel}
          libellé="Cyberdépart validé"
          infobulle="Total des organisations ayant validé Cyberdépart, mois par mois. «&nbsp;Cumul&nbsp;» signifie que chaque mois s’ajoute aux précédents&nbsp;: la courbe ne peut que monter."
          source={cyberdépartsValidés.source}
          date={cyberdépartsValidés.date}
        />
      </Rangee>
      <CompletionNiveauComplet {complétions} />
      <Rangee pleineLargeur>
        <RepartitionGeographique {cyberdépartsValidés} {complétions} />
      </Rangee>
    </SousSection>
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
