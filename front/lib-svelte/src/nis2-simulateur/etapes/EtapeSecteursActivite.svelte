<script lang="ts">
  import Etape from './Etape.svelte';
  import { TitresEtapes } from './TitresEtapes';
  import PrecedentSuivant from './PrecedentSuivant.svelte';
  import type { SecteurActivite } from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.definitions';
  import { libellesSecteursActivite } from '../../../../../back/src/metier/nis2-simulateur/LibellesSecteursActivite';
  import { SvelteSet } from 'svelte/reactivity';

  interface Props {
    onsuivant: (reponse: SecteurActivite[]) => void;
  }

  let props: Props = $props();
  let reponse: SvelteSet<SecteurActivite> = new SvelteSet<SecteurActivite>();

  const choisis = (secteur: string) => (e: { detail: boolean }) => {
    const checked = e.detail;
    if (checked) reponse.add(secteur as SecteurActivite);
    else reponse.delete(secteur as SecteurActivite);
  };

  const valide = () => {
    props.onsuivant([...reponse]);
  };
</script>

<Etape>
  <dsfr-stepper
    title={TitresEtapes['secteursActivite']}
    current-step="5"
    step-count="6"
    hide-details="true"
  ></dsfr-stepper>

  <p>
    Dans quels secteurs d'activités votre organisation produit-elle des biens
    et/ou des services ?
  </p>

  <dsfr-highlight
    size="sm"
    text="Il a été observé que certaines entités, lors de leur
        utilisation du simulateur, sélectionnent le secteur
        d'activité d'entités dont elles sont les
        fournisseurs ou les sous-traitants au lieu du secteur de
        réalisation de leurs propres activités.
        À titre d'exemple, un fournisseur de turbine
        d'éolienne, pouvant se considérer comme étant du secteur
        «&nbsp;Énergie&nbsp;», sera en réalité associé au secteur
        «&nbsp;Fabrication&nbsp;» (correspondant à l'industrie
        manufacturière) selon le prisme établi par la directive
        NIS&nbsp;2.
        Une telle confusion fausse les résultats du test. Les entités
        utilisant le simulateur sont donc invitées à renseigner les
        différentes rubriques avec le plus grand soin, avec un focus
        particulier sur le secteur Fabrication qui regroupe plus de
        500 activités distinctes."
  ></dsfr-highlight>

  {#each Object.entries(libellesSecteursActivite) as [id, label] (id)}
    <dsfr-checkbox
      id={`checkbox-${id}`}
      size="sm"
      {label}
      onvaluechanged={choisis(id)}
    ></dsfr-checkbox>
  {/each}

  <PrecedentSuivant
    message="Sélectionnez au moins une réponse"
    onsuivant={valide}
    suivantdisabled={reponse.size === 0}
  />
</Etape>

<style lang="scss">
  dsfr-checkbox {
    margin-bottom: 8px;
  }
</style>
