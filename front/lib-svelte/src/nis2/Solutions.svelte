<script lang="ts">
  import { onMount } from 'svelte';
  import type { ItemCyber } from '../catalogue/Catalogue.types';
  import {
    chargeGuidesDansLeStore,
    guidesStore,
  } from '../catalogue/stores/guides/guides.store';
  import ActionParcoursAvecItems from '../parcours/ActionParcoursAvecItems.svelte';
  import ControleSegmente from '../navigation/ControleSegmente.svelte';
  import { versItemsCyberOuGuide } from '../parcours/itemDuParcours';

  export let itemsCyber: ItemCyber[];

  onMount(chargeGuidesDansLeStore);

  $: versMesItems = versItemsCyberOuGuide(itemsCyber, $guidesStore);

  $: actions = [
    {
      id: 'comprendre',
      titre: 'Comprendre',
      explication: 'Se familiariser avec la menace cyber.',
      items: versMesItems([
        '/ressources/risques-cyber',
        '/ressources/panorama',
        '/guides/attaques-par-rancongiciels-tous-concernes',
      ]),
      ancre: 'solutions&comprendre',
    },
    {
      id: 'se-declarer',
      titre: 'Se déclarer',
      explication:
        "Vérifiez si votre entité est concernée et procédez à son enregistrement auprès de l'ANSSI.",
      items: versMesItems(['/services/NIS2', '/services/mon-espace-nis2']),
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
        '/guides/la-cybersecurite-pour-les-tpepme-en-treize-questions',
        '/guides/la-methode-ebios-risk-manager-le-guide',
      ]),
      ancre: 'solutions&reduire-risques',
    },
    {
      id: 'se-preparer',
      titre: 'Se préparer',
      explication:
        'Supervisez et préparez votre organisation à l’éventualité d’une attaque.',
      items: versMesItems([
        '/guides/organiser-un-exercice-de-gestion-de-crise-cyber',
        '/guides/la-supervision-de-securite-les-cles-de-decision',
      ]),
      ancre: 'solutions&se-preparer',
    },
    {
      id: 'reagir-incident',
      titre: 'Réagir à un incident',
      explication:
        'Agissez et signalez à l’ANSSI vos incidents de sécurité et sollicitez une assistance.',
      items: versMesItems([
        '/services/assistance-reponse-incidents',
        '/guides/cyberattaques-et-remediation-les-cles-de-decision',
        '/guides/anticiper-et-gerer-sa-communication-de-crise-cyber',
      ]),
      ancre: 'solutions&reagir-incident',
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
