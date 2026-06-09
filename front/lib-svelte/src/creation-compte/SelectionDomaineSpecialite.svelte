<script lang="ts">
  import ChampTexte from '../ui/ChampTexte.svelte';

  const domaines = [
    { id: 'RSSI', libelle: 'Cybersécurité / SSI' },
    { id: 'DSI', libelle: 'Numérique et systèmes d’information' },
    { id: 'METIER', libelle: 'Direction métier' },
    { id: 'DPO', libelle: 'Protection des données' },
    { id: 'JURI', libelle: 'Juridique' },
    { id: 'RISQ', libelle: 'Gestion des risques' },
    { id: 'DG', libelle: 'Direction générale' },
    { id: 'autre', libelle: 'Autre' },
  ];

  type Props = {
    id: string;
    valeurs: string[];
    requis?: boolean;
  };

  let { id, valeurs = $bindable(), requis = false }: Props = $props();

  const elementsSelectionnables = domaines.map((d) => ({ ...d, value: d.id, label: d.libelle }));
  let elementsSelectionnes = $state(valeurs);

  const afficheAutre = $derived(elementsSelectionnes.includes('autre'));
  let autreDomaine = $state<string>('');
  $effect(() => {
    valeurs = [...elementsSelectionnes.filter((e) => e !== 'autre'), ...(afficheAutre ? [autreDomaine] : '')];
  });
</script>

<div class="conteneur-selection-domaine-specialite">
  <lab-anssi-multi-select
    {id}
    label=""
    placeholder="Sélectionner un domaine de spécialité"
    options={elementsSelectionnables}
    values={elementsSelectionnes}
    onvaluechanged={(e: CustomEvent<string[]>) => {
      elementsSelectionnes = e.detail;
    }}
  ></lab-anssi-multi-select>
  {#if afficheAutre}
    <ChampTexte
      id="autreDomaine"
      libelle="Merci de préciser votre domaine de spécialité"
      messageErreur="La précision du domaine de spécialité est obligatoire. Veuillez la renseigner."
      nom="autreDomaine"
      {requis}
      bind:valeur={autreDomaine}
    />
  {/if}
</div>
