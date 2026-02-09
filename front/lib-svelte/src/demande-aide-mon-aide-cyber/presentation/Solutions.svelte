<script lang="ts">
  import type { ItemCyber } from '../../catalogue/Catalogue.types';
  import ControleSegmente from '../../navigation/ControleSegmente.svelte';
  import ActionParcoursAvecItems from '../../parcours/ActionParcoursAvecItems.svelte';

  export let itemsCyber: ItemCyber[];

  const versItemsCyber = (idsItem: string[]) =>
    idsItem.reduce((accumulateur, id) => {
      const item = itemsCyber.find((itemCyber) => itemCyber.id === id);
      if (item) {
        accumulateur.push(item);
      }
      return accumulateur;
    }, [] as ItemCyber[]);

  const actions = [
    {
      id: 'comprendre',
      titre: 'Comprendre',
      explication:
        'Découvrez les enjeux de sécurité et les obligations pesant sur les collectivités',
      items: versItemsCyber([]),
      ancre: 'solutions&comprendre',
    },
    {
      id: 'sensibiliser',
      titre: 'Sensibiliser',
      explication:
        'Sensibilisez les dirigeants et les salariés aux risques cyber et aux bonnes pratiques.',
      items: versItemsCyber([
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
      items: versItemsCyber([
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
      items: versItemsCyber([
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
      items: versItemsCyber([]),
      ancre: 'solutions&se-preparer',
    },
    {
      id: 'reagir',
      titre: 'Réagir',
      explication: "Agissez en cas d'incident de sécurité.",
      items: versItemsCyber(['/services/diagnostic-17cyber']),
      ancre: 'solutions&reagir',
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
