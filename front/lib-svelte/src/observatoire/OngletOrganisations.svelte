<script lang="ts">
  import CarteDonnees from '../graphiques/CarteDonnees.svelte';
  import GraphiqueCirculaire from '../graphiques/GraphiqueCirculaire.svelte';
  import type { DonnéesObservatoire } from '../passerelles/observatoire';
  import ChiffreCle from './ChiffreCle.svelte';
  import EtatDuChargement from './EtatDuChargement.svelte';
  import { formateDate, formateNombre } from './formatage';
  import Onglet from './Onglet.svelte';
  import Rangee from './Rangee.svelte';
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
    {@const { testsMaturité } = données}
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
