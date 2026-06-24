<script lang="ts">
  import Bouton, { type Props as PropsDuBouton } from '../ui/Bouton.svelte';

  type Props = {
    typeDuBouton: PropsDuBouton['type'];
  };
  const { typeDuBouton }: Props = $props();

  const { protocol, host } = window.location;
  const lienModule = `${protocol}://${host}/module-cyberdepart`;
  const urlLinkedIn = `https://www.linkedin.com/shareArticle?url=${lienModule}&title=Test de maturité Cyber`;

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
