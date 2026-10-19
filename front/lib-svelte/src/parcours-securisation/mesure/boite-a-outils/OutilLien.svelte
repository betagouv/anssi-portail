<script lang="ts">
  type Props = {
    href: string;
    titre: string;
    nomIcone: string;
  };
  const { href, titre, nomIcone }: Props = $props();
  const src = $derived(`/assets/images/parcours-securisation/outils/${nomIcone}.svg`);
</script>

<div class="outil">
  <dsfr-card
    title={titre}
    size="sm"
    horizontal="true"
    {href}
    enlarge="true"
    has-badge="true"
    {src}
    has-header-badge="true"
  >
    <div slot="headerbadges">
      <dsfr-badge label="Outil sécurisation" type="accent" accent="green-emeraude" size="sm"></dsfr-badge>
    </div>
  </dsfr-card>
</div>

<style lang="scss">
  .outil {
    display: flex;
    flex-direction: column;

    dsfr-card {
      min-height: auto;
    }
  }
</style>
