<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';

  let maintenanceEnPreparation: { jour: string; heure: string } | undefined =
    undefined;
  onMount(async () => {
    const reponse = await axios.get('/api/infos-site');
    maintenanceEnPreparation = reponse.data.maintenanceEnPreparation;
  });
</script>

{#if maintenanceEnPreparation}
  <section id="maintenance">
    <div class="contenu-section">
      <p>
        <span class="prevision"
        >Une maintenance est prévue le {maintenanceEnPreparation.jour}
          sur MesServicesCyber, de {maintenanceEnPreparation.heure}.</span
        >
        <span
        >La plateforme sera inaccessible. Nous nous excusons pour la gêne
          occasionnée.</span
        >
      </p>
    </div>
  </section>
{/if}

<style lang="scss">
  section#maintenance {
    padding: 12px var(--gouttiere) !important;
    background-color: #ffe9e6;
    color: #b34000;
  }

  .contenu-section {
    display: flex;
    gap: 8px;

    &:before {
      content: "";
      background: url("/assets/icones/icone-danger.svg");
      min-width: 24px;
      height: 24px;
    }
  }

  p {
    margin: 0;

    .prevision {
      font-weight: bold;
    }
  }
</style>
