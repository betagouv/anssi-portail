<script lang="ts">
  import Bouton, { type Props as PropsDuBouton } from '../ui/Bouton.svelte';

  type Props = {
    typeDuBouton: PropsDuBouton['type'];
  };
  const { typeDuBouton }: Props = $props();

  const { protocol, host } = window.location;
  const lienPagePartagée = `${protocol}://${host}/partage-badge-cyberdepart`;
  const urlLinkedIn = `https://www.linkedin.com/sharing/share-offsite?url=${lienPagePartagée}`;

  const partageLinkedIn = () => {
    window.open(
      urlLinkedIn,
      'Partager sur LinkedIn',
      'toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=550,height=550'
    );
  };
</script>

<Bouton
  titre="Partager sur LinkedIn"
  libelle="Partager sur LinkedIn"
  surClic={partageLinkedIn}
  icone="linkedin-box-line"
  etire={true}
  type={typeDuBouton}
/>
