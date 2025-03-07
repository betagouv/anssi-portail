<script lang="ts">
  import MenuFlottant from '../ui/MenuFlottant.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import ControleFormulaire from '../ui/ControleFormulaire.svelte';
  import { validationChamp } from '../directives/validationChamp';
  import { tick } from 'svelte';

  export let valeurs: string[];
  export let requis: boolean = false;
  export let id: string = '';
  let menu: MenuFlottant;
  let autreDomaine: string = '';
  let champDeclencheur: HTMLInputElement;

  if (!valeurs) valeurs = [];

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
  const idsDesDomaines = domaines.map((f) => f.id);

  let selection: string[] = valeurs.filter((v) => idsDesDomaines.includes(v));
  const autreValeur = valeurs.find((v) => !idsDesDomaines.includes(v));
  if (autreValeur) {
    selection.push('autre');
    autreDomaine = autreValeur;
  }

  $: label = selection
    .map((id) => domaines.find((f) => f.id === id)?.libelle)
    .join(', ');

  $: {
    if (label) {
      tick().then(() => champDeclencheur.dispatchEvent(new Event('input')));
    }
  }

  $: labelRappelDeclencheur =
    selection.length === 0 ? 'Sélectionner un domaine de spécialité' : label;

  $: afficheAutre = selection.includes('autre');
  $: valeurs = [
    ...selection.filter((f) => f !== 'autre'),
    ...(afficheAutre ? [autreDomaine] : ''),
  ];

  const refermeMenu = () => menu.fermeLeMenu();
</script>

<div class="conteneur-selection-domaine-specialite">
  <MenuFlottant
    bind:this={menu}
    parDessusDeclencheur={true}
    classePersonnalisee="selection-domaine"
  >
    <div slot="declencheur" class="avec-fleche">
      <input
        {id}
        type="text"
        role="button"
        placeholder="Sélectionner un domaine de spécialité"
        class="bouton bouton-secondaire contenu-declencheur"
        class:complete={selection.length > 0}
        bind:value={label}
        required
        use:validationChamp={requis
          ? 'Le domaine est obligatoire. Veuillez le renseigner.'
          : ''}
        bind:this={champDeclencheur}
      />
    </div>
    <div class="domaines">
      <div
        role="button"
        tabindex="0"
        on:keypress
        class="rappel-declencheur contenu-declencheur"
        on:click|stopPropagation|preventDefault={refermeMenu}
      >
        {labelRappelDeclencheur}
      </div>
      <div class="options">
        {#each domaines as domaine}
          <div class="case-et-label">
            <input
              type="checkbox"
              bind:group={selection}
              id={domaine.id}
              name={domaine.id}
              value={domaine.id}
            />
            <label for={domaine.id}>{domaine.libelle}</label>
          </div>
        {/each}
      </div>
    </div>
  </MenuFlottant>
  {#if afficheAutre}
    <ControleFormulaire
      {requis}
      libelle="Merci de préciser votre domaine de spécialité"
    >
      <ChampTexte
        id="autreDomaine"
        nom="autreDomaine"
        bind:valeur={autreDomaine}
        {requis}
        messageErreur="La précision du domaine de spécialité est obligatoire. Veuillez la renseigner."
      />
    </ControleFormulaire>
  {/if}
</div>
