<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { ExigenceNis2 } from './exigence.type';
  import TableauExigencesNIS2Simple from './tableaux/TableauExigencesNIS2Simple.svelte';

  let exigencesNis2: ExigenceNis2[] = [];

  onMount(async () => {
    const axiosResponse = await axios.get<ExigenceNis2[]>(
      '/api/exigences-nis2'
    );
    exigencesNis2 = axiosResponse.data;
  });
</script>

<dsfr-container>
  <dsfr-alert type="info" size="md">
    <p slot="description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce blandit
      blandit mattis. Duis convallis orci dolor, in vulputate neque ultricies
      cursus. Vestibulum tempus quam quis scelerisque viverra. Vestibulum at
      luctus tortor, eu eleifend justo. Vivamus posuere diam ac ultricies
      gravida.
      <dsfr-link label="En savoir plus sur le référentiel ReCyF" href="#" blank
      ></dsfr-link>
    </p>
  </dsfr-alert>
  <h2>Liste des exigences NIS 2</h2>
  <TableauExigencesNIS2Simple {exigencesNis2} />
  <dsfr-link
    label="Haut de page"
    href="#"
    size="md"
    has-icon
    icon="arrow-up-fill"
  ></dsfr-link>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-bottom: 4.5rem;

    dsfr-alert {
      margin-bottom: 1.5rem;
    }
  }
</style>
