<script lang="ts">
  import { afficheNouvelleDA } from '$plateforme/environnement';

  interface Props {
    texteAlternatif: string;
  }

  let { texteAlternatif }: Props = $props();
</script>

<img
  src="/assets/images/illustration-dragon-aucun-resultat{afficheNouvelleDA ? '-nouvelle-da' : ''}.svg"
  width="175"
  height="317"
  alt={texteAlternatif}
/>
