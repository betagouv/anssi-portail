<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { DonnéesObservatoire, SeuilComplétion } from '../passerelles/observatoire';
  import ChiffreCle from './ChiffreCle.svelte';
  import EvolutionMensuelle from './EvolutionMensuelle.svelte';
  import { formateNombre, libelléDuSeuil } from './formatage';
  import Rangee from './Rangee.svelte';

  interface Props {
    complétions: DonnéesObservatoire['organisations']['complétions'];
  }

  let { complétions }: Props = $props();

  let seuil: SeuilComplétion = $state(50);

  const complétion = $derived(complétions.parSeuil.find((parSeuil) => parSeuil.seuil === seuil));
  const segments = $derived(
    complétions.parSeuil.map((parSeuil) => ({
      id: `seuil-completion-${parSeuil.seuil}`,
      name: 'seuil-completion',
      label: libelléDuSeuil(parSeuil.seuil),
      value: parSeuil.seuil,
    }))
  );
</script>

<div class="choix-seuil">
  <dsfr-segmented
    size="sm"
    legend="Seuil de complétion du niveau complet"
    elements={enPropriétéWebC(segments)}
    value={seuil}
    onvaluechanged={(e: CustomEvent<SeuilComplétion>) => (seuil = e.detail)}
  ></dsfr-segmented>
</div>

{#if complétion}
  <Rangee>
    <ChiffreCle
      id="completion-niveau-complet"
      titre="Niveau complet&nbsp;: complétion globale"
      valeur={formateNombre(complétion.total)}
      infobulle="Nombre d’organisations qui ont appliqué au moins la part choisie (50&nbsp;%, 80&nbsp;% ou 100&nbsp;%) des mesures du niveau complet."
      source={complétions.source}
      date={complétions.date}
    />
    <EvolutionMensuelle
      id="evolution-completion-niveau-complet"
      série={complétion.cumulMensuel}
      libellé="Complétion {libelléDuSeuil(seuil)}"
      infobulle="Évolution du nombre d’organisations qui ont appliqué au moins la part choisie (50&nbsp;%, 80&nbsp;% ou 100&nbsp;%) des mesures du niveau complet."
      source={complétions.source}
      date={complétions.date}
    />
  </Rangee>
{/if}

<style lang="scss">
  .choix-seuil {
    margin-top: 1.5rem;
  }
</style>
