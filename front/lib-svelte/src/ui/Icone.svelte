<script lang="ts">
  type Icone = 'check' | 'fleche-gauche';

  const srcDesIcones: Record<Icone, { chemin: string; width: number; height: number }> = {
    'fleche-gauche': { chemin: '/assets/icones/icone-fleche-gauche.svg', width: 16, height: 16 },
    check: { chemin: '/assets/icones/icone-check-line.svg', width: 24, height: 24 },
  };

  export let type: Icone;
</script>

<img src={srcDesIcones[type].chemin} width={srcDesIcones[type].width} height={srcDesIcones[type].height} alt="" />
