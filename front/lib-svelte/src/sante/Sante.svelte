<script context="module" lang="ts">
  export type Etat = 'ok' | 'ko';
  type TailleImage = '234' | '588' | 'origine';
  export type SanteGuide = {
    id: string;
    documents: { nom: string; etat: Etat }[];
    images: Record<TailleImage, Etat>;
  };
  type SanteGuides = {
    guidesAvecProbleme: SanteGuide[];
    guidesEnBonneSante: SanteGuide[];
  };
</script>

<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import TableSanteGuides from './TableSanteGuides.svelte';

  let guidesAvecDocumentsManquants: SanteGuide[] = [];

  let guidesOk: SanteGuide[] = [];

  onMount(async () => {
    const reponse = await axios.get<SanteGuides>('/api/sante-guides');
    guidesOk = reponse.data.guidesEnBonneSante;
    guidesAvecDocumentsManquants = reponse.data.guidesAvecProbleme;
  });
</script>

<dsfr-container>
  <h2>Santé des guides</h2>

  <h3>Documents/images absents</h3>
  <TableSanteGuides guides={guidesAvecDocumentsManquants}></TableSanteGuides>

  <h3>Ok</h3>
  <TableSanteGuides guides={guidesOk}></TableSanteGuides>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-top: 48px;
    padding-bottom: 48px;
  }
</style>
