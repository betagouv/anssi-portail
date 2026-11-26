<script lang="ts">
  import CarteDonnees from '@graphiques/CarteDonnees.svelte';
  import GraphiqueLineaire from '@graphiques/GraphiqueLineaire.svelte';
  import type { PointMensuel } from '@passerelles/observatoire';
  import { formateDate, formateNombre, libelleDuMois } from './formatage';

  interface Props {
    id: string;
    série: PointMensuel[];
    libellé: string;
    infobulle: string;
    source: string;
    date: Date | null;
  }

  let { id, série, libellé, infobulle, source, date }: Props = $props();
</script>

<CarteDonnees
  {id}
  titre="Évolution par mois (cumul)"
  {infobulle}
  {source}
  date={date ? formateDate(date) : undefined}
  tableau={{
    colonnes: ['Mois', libellé],
    lignes: série.map((point) => [libelleDuMois(point.mois), formateNombre(point.valeur)]),
  }}
>
  <GraphiqueLineaire
    x={série.map((point) => libelleDuMois(point.mois))}
    y={série.map((point) => point.valeur)}
    nom={libellé}
    unite={libellé}
  />
</CarteDonnees>
