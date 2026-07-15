<script lang="ts">
  type Props = {
    description?: string;
    estRejetable: boolean;
    lien?: {
      url: string;
      titre: string;
      libelle: string;
    };
    titre: string;
  };
  const { description, estRejetable, lien, titre }: Props = $props();
</script>

<dsfr-notice
  desc={description}
  dismissible={estRejetable ? true : undefined}
  hasDescription={description ? true : undefined}
  hasLink={lien ? true : undefined}
  linkHref={lien?.url}
  linkLabel={lien?.libelle}
  linkTitle={lien?.titre}
  title={titre}
></dsfr-notice>
