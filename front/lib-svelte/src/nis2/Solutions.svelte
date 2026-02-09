<script lang="ts">
  import type { ItemCyber } from '../catalogue/Catalogue.types';
  import ActionParcoursAvecItems from './ActionParcoursAvecItems.svelte';
  import ControleSegmente from '../navigation/ControleSegmente.svelte';

  export let itemsCyber: ItemCyber[];

  const versItemsCyber = (idsItem: string[]) =>
    itemsCyber.filter((i) => idsItem.includes(i.id));

  const actions = [
    {
      id: 'comprendre',
      titre: 'Comprendre',
      explication: 'Se familiariser avec la menace cyber.',
      items: versItemsCyber(['/services/mon-espace-nis2']),
      ancre: 'solutions&comprendre',
    },
    {
      id: 'se-declarer',
      titre: 'Se déclarer',
      explication:
        "Vérifiez si votre entité est concernée et procédez à son enregistrement auprès de l'ANSSI.",
      items: versItemsCyber(['/services/NIS2']),
      ancre: 'solutions&se-declarer',
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
      ancre: 'solutions&reduire-risques',
    },
    {
      id: 'se-preparer',
      titre: 'Se préparer',
      explication: 'Signalez à l’ANSSI vos incidents de sécurité.',
      items: versItemsCyber(['/services/assistance-reponse-incidents']),
      ancre: 'solutions&se-preparer',
    },
    {
      id: 'declarer-incident',
      titre: 'Déclarer un incident',
      explication: 'Signalez à l’ANSSI vos incidents de sécurité.',
      items: versItemsCyber(['/services/assistance-reponse-incidents']),
      ancre: 'solutions&declarer-incident',
    },
  ];
</script>

<div id="solutions">
  <ControleSegmente elements={actions} selecteurSections=".action">
    {#each actions as action, index (action.id)}
      <ActionParcoursAvecItems
        id={action.id}
        titre={action.titre}
        explication={action.explication}
        items={action.items}
        fondAlternatif={index % 2 === 1}
        ancre={action.ancre}
      ></ActionParcoursAvecItems>
    {/each}
  </ControleSegmente>
</div>

<style lang="scss">
</style>
