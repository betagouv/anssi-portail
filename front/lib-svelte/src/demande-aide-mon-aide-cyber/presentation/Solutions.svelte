<script lang="ts">
  import { onMount } from 'svelte';
  import type { ItemCyber } from '../../catalogue/Catalogue.types';
  import {
    chargeGuidesDansLeStore,
    guidesStore,
  } from '../../catalogue/stores/guides/guides.store';
  import ControleSegmente from '../../navigation/ControleSegmente.svelte';
  import ActionParcoursAvecItems from '../../parcours/ActionParcoursAvecItems.svelte';
  import { versItemsCyberOuGuide } from '../../parcours/itemDuParcours';

  export let itemsCyber: ItemCyber[];

  onMount(chargeGuidesDansLeStore);

  $: versMesItems = versItemsCyberOuGuide(itemsCyber, $guidesStore);
  $: actions = [
    {
      id: 'comprendre',
      titre: 'Comprendre',
      explication:
        'Découvrez les enjeux de sécurité et les obligations pesant sur les collectivités',
      items: versMesItems([
        '/guides/securite-numerique-des-collectivites-territoriales-lessentiel-de-la-reglementation',
        '/guides/recommandations-pour-le-reconditionnement-des-ordinateurs-de-bureau-ou-portables',
        '/guides/cybersecurite-toutes-les-communes-et-intercommunalites-sont-concernees',
      ]),
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
        '/guides/attaques-par-rancongiciels-tous-concernes',
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
      items: versMesItems([
        '/guides/organiser-un-exercice-de-gestion-de-crise-cyber',
      ]),
      ancre: 'solutions&se-preparer',
    },
    {
      id: 'reagir',
      titre: 'Réagir',
      explication: "Agissez en cas d'incident de sécurité.",
      items: versMesItems([
        '/guides/la-supervision-de-securite-les-cles-de-decision',
        '/services/diagnostic-17cyber',
        '/guides/anticiper-et-gerer-sa-communication-de-crise-cyber',
      ]),
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
