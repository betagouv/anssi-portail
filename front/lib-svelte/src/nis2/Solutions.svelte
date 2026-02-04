<script lang="ts">
  import type { ItemCyber } from '../catalogue/Catalogue.types';
  import ActionParcoursAvecItems from './ActionParcoursAvecItems.svelte';
  import ControleSegmente from './ControleSegmente.svelte';

  export let itemsCyber: ItemCyber[];

  const versItemsCyber = (idsItem: string[]) =>
    itemsCyber.filter((i) => idsItem.includes(i.id));

  const actions = [
    {
      id: 'comprendre',
      titre: 'Comprendre',
      explication: 'Se familiariser avec la menace cyber.',
      items: versItemsCyber(['/services/mon-espace-nis2']),
    },
    {
      id: 'se-declarer',
      titre: 'Se déclarer',
      explication:
        "Vérifiez si votre entité est concernée et procédez à son enregistrement auprès de l'ANSSI.",
      items: versItemsCyber(['/services/NIS2']),
    },
    {
      id: 'reduire-risques',
      titre: 'Réduire les risques',
      explication: 'Mettez en place des mesures de sécurité adaptées.',
      items: versItemsCyber([
        '/services/mon-aide-cyber',
        '/services/silene',
        '/services/ads',
        '/services/conseil-technique',
        '/ressources/revue-presse',
      ]),
    },
    {
      id: 'se-preparer',
      titre: 'Se préparer',
      explication: 'Signalez à l’ANSSI vos incidents de sécurité.',
      items: versItemsCyber(['/services/assistance-reponse-incidents']),
    },
    {
      id: 'declarer-incident',
      titre: 'Déclarer un incident',
      explication: 'Signalez à l’ANSSI vos incidents de sécurité.',
      items: versItemsCyber(['/services/assistance-reponse-incidents']),
    },
  ];
</script>

<ControleSegmente elements={actions}></ControleSegmente>

{#each actions as action, index (action.id)}
  <ActionParcoursAvecItems
    id={action.id}
    titre={action.titre}
    explication={action.explication}
    items={action.items}
    fondAlternatif={index % 2 === 1}
  ></ActionParcoursAvecItems>
{/each}

<style lang="scss">
</style>
