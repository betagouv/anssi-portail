<script lang="ts">
  import { DsfrNotice } from '@lab-anssi/ui-kit';

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

<DsfrNotice
  type={typeDsfr}
  hasIcon={aUneIcone}
  desc={description}
  dismissible={estRejetable}
  hasDescription={Boolean(description)}
  hasLink={Boolean(lien)}
  buttonLabel="Masquer le message"
  linkHref={lien?.url}
  linkLabel={lien?.libelle}
  linkTitle={lien?.titre}
  title={titre}
></DsfrNotice>
