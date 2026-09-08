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
    type?: 'attention' | 'info';
    aUneIcone?: boolean;
  };
  const { description, estRejetable, lien, titre, type, aUneIcone = false }: Props = $props();

  const typeDsfr = $derived.by(() => {
    switch (type) {
      case 'attention':
        return 'warning';
      default:
        return undefined;
    }
  });
</script>

<dsfr-notice
  type={typeDsfr}
  has-icon={aUneIcone || undefined}
  desc={description}
  dismissible={estRejetable ? true : undefined}
  hasDescription={description ? true : undefined}
  hasLink={lien ? true : undefined}
  linkHref={lien?.url}
  linkLabel={lien?.libelle}
  linkTitle={lien?.titre}
  title={titre}
></dsfr-notice>
