<script lang="ts">
  import type { ItemCyber } from '../catalogue/Catalogue.types';
  import ActionParcoursAvecItems from '../parcours/ActionParcoursAvecItems.svelte';
  import ControleSegmente from '../navigation/ControleSegmente.svelte';
  import { versItemsCyberOuGuide } from '../parcours/itemDuParcours';

  export let itemsCyber: ItemCyber[];

  const versMesItems = versItemsCyberOuGuide(itemsCyber, []);

  const actions = [
    {
      id: 'comprendre',
      titre: 'Comprendre',
      explication: 'Se familiariser avec la menace cyber.',
      items: versMesItems(['/services/mon-espace-nis2']),
      ancre: 'solutions&comprendre',
    },
    {
      id: 'se-declarer',
      titre: 'Se déclarer',
      explication:
        "Vérifiez si votre entité est concernée et procédez à son enregistrement auprès de l'ANSSI.",
      items: versMesItems(['/services/NIS2']),
      ancre: 'solutions&se-declarer',
    },
    {
      id: 'reduire-risques',
      titre: 'Réduire les risques',
      explication: 'Mettez en place des mesures de sécurité adaptées.',
      items: versMesItems([
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
      items: versMesItems(['/services/assistance-reponse-incidents']),
      ancre: 'solutions&se-preparer',
    },
    {
      id: 'declarer-incident',
      titre: 'Déclarer un incident',
      explication: 'Signalez à l’ANSSI vos incidents de sécurité.',
      items: versMesItems(['/services/assistance-reponse-incidents']),
      ancre: 'solutions&declarer-incident',
    },
  ];
</script>

<div id="solutions">
  <ControleSegmente elements={actions} selecteurSections=".action">
    {#each actions as action, index (action.id)}
      <ActionParcoursAvecItems
        titre={action.titre}
        explication={action.explication}
        items={action.items}
        fondAlternatif={index % 2 === 1}
        ancre={action.ancre}
        sourceIllustration={`/assets/images/illustration-${action.id}.svg`}
      ></ActionParcoursAvecItems>
    {/each}
  </ControleSegmente>
</div>

<style lang="scss">
</style>
