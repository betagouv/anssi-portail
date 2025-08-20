<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import DetailsFinancement from './DetailsFinancement.svelte';
  import type { ResumeFinancement } from './financement';
  import ListeDesFinancements from './ListeDesFinancements.svelte';

  type ReponseAxios = {
    id: number;
    nom: string;
    financeur: string;
    entitesElligibles: string[];
    typesDeFinancement: string[];
    perimetresGeographiques: string[];
  }[];

  let financements: ResumeFinancement[] | undefined;
  let financementSeclectionne: ResumeFinancement | undefined;

  const idFinancement = Number(
    new URLSearchParams(window.location.search).get('idFinancement')
  );

  onMount(async () => {
    try {
      const reponse = await axios.get<ReponseAxios>('/api/financements');
      financements = reponse.data.map((f) => ({ ...f, regions: [] }));
    } catch {
      financements = [];
    }
  });

  $: financementSeclectionne = financements?.find(
    (f) => f.id === idFinancement
  );
</script>

{#if financementSeclectionne}
  <DetailsFinancement resumeFinancement={financementSeclectionne} />
{:else if !idFinancement}
  <ListeDesFinancements {financements} />
{/if}
