<script lang="ts">
  import { enPropriétéWebC } from '@plateforme/webComponent';
  import CarteDepartements from '@graphiques/CarteDepartements.svelte';
  import CarteDonnees from '@graphiques/CarteDonnees.svelte';
  import type { DonnéesObservatoire } from '@passerelles/observatoire';

  import { formateDate, formateNombre, libelléDuSeuil } from './formatage';

  interface Props {
    cyberdépartsValidés: DonnéesObservatoire['organisations']['cyberdépartsValidés'];
    complétions: DonnéesObservatoire['organisations']['complétions'];
  }

  let { cyberdépartsValidés, complétions }: Props = $props();

  const indicateurs = $derived([
    {
      libellé: 'Cyberdépart validé',
      nom: 'Cyberdépart validé',
      total: cyberdépartsValidés.total,
      parDépartement: cyberdépartsValidés.parDépartement,
    },
    ...complétions.parSeuil.map(({ seuil, total, parDépartement }) => ({
      libellé: libelléDuSeuil(seuil),
      nom: `Complétion ${libelléDuSeuil(seuil)}`,
      total,
      parDépartement,
    })),
  ]);

  let indexIndicateur = $state(0);

  const indicateur = $derived(indicateurs[indexIndicateur]);
  const départementsRenseignés = $derived(
    indicateur.parDépartement.filter(({ total }) => total > 0).toSorted((a, b) => b.total - a.total)
  );
  const segments = $derived(
    indicateurs.map(({ libellé }, index) => ({
      id: `indicateur-carte-${index}`,
      name: 'indicateur-carte',
      label: libellé,
      value: index,
    }))
  );
</script>

<CarteDonnees
  id="repartition-geographique"
  titre="Répartition géographique du parcours de sécurisation"
  source={cyberdépartsValidés.source}
  date={cyberdépartsValidés.date ? formateDate(cyberdépartsValidés.date) : undefined}
  tableau={{
    colonnes: ['Département', indicateur.nom],
    lignes: départementsRenseignés.map(({ code, nom, total }) => [`${nom} (${code})`, formateNombre(total)]),
  }}
>
  {#snippet réglages()}
    <dsfr-segmented
      size="sm"
      legend="Indicateur affiché sur la carte"
      no-legend
      elements={enPropriétéWebC(segments)}
      value={indexIndicateur}
      onvaluechanged={(e: CustomEvent<number>) => (indexIndicateur = e.detail)}
    ></dsfr-segmented>
  {/snippet}
  <CarteDepartements totaux={indicateur.parDépartement} nom={indicateur.nom} totalNational={indicateur.total} />
</CarteDonnees>
