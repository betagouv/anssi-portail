<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import type { ItemCyber } from '../catalogue/Catalogue.types';
  import type { Guide } from '../catalogue/Guide.types';
  import { guidePourCarteItem } from '../catalogue/guides/guide';
  import { chargeGuidesDansLeStore, guidesStore } from '../catalogue/stores/guides/guides.store';
  import ControleSegmenteAvecSections from '../navigation/ControleSegmenteAvecSections.svelte';
  import ActionParcoursAvecItems from '../parcours/ActionParcoursAvecItems.svelte';
  import { versItemsCyberOuGuide } from '../parcours/itemDuParcours';

  type Props = {
    itemsCyber: ItemCyber[];
    guides?: Guide[];
  };
  let { itemsCyber, guides }: Props = $props();
  const guidesInitiaux = untrack(() => guides);
  if (guidesInitiaux) {
    guidesStore.initialise(guidesInitiaux.map(guidePourCarteItem));
  }

  onMount(chargeGuidesDansLeStore);

  const versMesItems = $derived(versItemsCyberOuGuide(itemsCyber, $guidesStore));
  const actions = $derived([
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
      explication: "Vérifiez si votre entité est concernée et procédez à son enregistrement auprès de l'ANSSI.",
      items: versMesItems(['/services/NIS2', '/services/mon-espace-nis2']),
      ancre: 'solutions&se-declarer',
    },
    {
      id: 'reduire-risques',
      titre: 'Réduire les risques',
      explication: 'Mettez en place des mesures de sécurité adaptées.',
      items: versMesItems([
        '/services/mon-aide-cyber',
        { id: '/services/silene', tagsSpecifiques: ['Entités publiques'] },
        { id: '/services/ads', tagsSpecifiques: ['Entités publiques'] },
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
      explication: "Supervisez et préparez votre organisation à l'éventualité d'une attaque.",
      items: versMesItems([
        '/guides/organiser-un-exercice-de-gestion-de-crise-cyber',
        '/guides/la-supervision-de-securite-les-cles-de-decision',
      ]),
      ancre: 'solutions&se-preparer',
    },
    {
      id: 'reagir-incident',
      titre: 'Réagir à un incident',
      explication: "Agissez et signalez à l'ANSSI vos incidents de sécurité et sollicitez une assistance.",
      items: versMesItems([
        '/services/assistance-reponse-incidents',
        '/guides/cyberattaques-et-remediation-les-cles-de-decision',
        '/guides/anticiper-et-gerer-sa-communication-de-crise-cyber',
      ]),
      ancre: 'solutions&reagir-incident',
    },
  ]);
</script>

<div id="solutions">
  <ControleSegmenteAvecSections elements={actions} selecteurSections=".action">
    {#each actions as action, index (action.id)}
      <ActionParcoursAvecItems
        titre={action.titre}
        explication={action.explication}
        items={action.items}
        fondAlternatif={index % 2 === 1}
        ancre={action.ancre}
      ></ActionParcoursAvecItems>
    {/each}
  </ControleSegmenteAvecSections>
</div>

<style lang="scss">
</style>
