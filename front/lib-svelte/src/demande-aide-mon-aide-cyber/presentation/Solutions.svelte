<script lang="ts">
  import type { ItemCyber } from '../../catalogue/Catalogue.types';
  import ControleSegmente from '../../navigation/ControleSegmente.svelte';
  import ActionParcoursAvecItems from '../../parcours/ActionParcoursAvecItems.svelte';
  import { versItemsCyber } from '../../parcours/versItemCyber';

  export let itemsCyber: ItemCyber[];

  const versMesItems = versItemsCyber(itemsCyber);

  const actions = [
    {
      id: 'comprendre',
      titre: 'Comprendre',
      explication:
        'Découvrez les enjeux de sécurité et les obligations pesant sur les collectivités',
      items: versMesItems([]),
      ancre: 'solutions&comprendre',
    },
    {
      id: 'sensibiliser',
      titre: 'Sensibiliser',
      explication:
        'Sensibilisez les dirigeants et les salariés aux risques cyber et aux bonnes pratiques.',
      items: versMesItems([
        '/ressources/risques-cyber',
        '/ressources/malette-cyber',
        '/ressources/panorama',
      ]),
      ancre: 'solutions&sensibiliser',
    },
    {
      id: 'se-former',
      titre: 'Se former',
      explication: 'Développez les compétences cyber de vos équipes.',
      items: versMesItems([
        '/services/mooc-ebios-rm',
        '/services/secnum-academie',
        '/services/sens-cyber',
      ]),
      ancre: 'solutions&se-former',
    },
    {
      id: 'securiser',
      titre: 'Sécuriser',
      explication:
        "Agissez pour renforcer le niveau de protection de vos systèmes d'information.",
      items: versMesItems([
        '/services/mon-aide-cyber',
        '/services/mon-service-securise',
        '/services/silene',
        '/services/ads',
      ]),
      ancre: 'solutions&securiser',
    },
    {
      id: 'se-preparer',
      titre: 'Se préparer',
      explication:
        "Organisez et exercez votre organisation à faire face à une crise d'origine cyber.",
      items: versMesItems([]),
      ancre: 'solutions&se-preparer',
    },
    {
      id: 'reagir',
      titre: 'Réagir',
      explication: "Agissez en cas d'incident de sécurité.",
      items: versMesItems(['/services/diagnostic-17cyber']),
      ancre: 'solutions&reagir',
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
      ></ActionParcoursAvecItems>
    {/each}
  </ControleSegmente>
</div>

<style lang="scss">
</style>
