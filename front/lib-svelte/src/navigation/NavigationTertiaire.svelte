<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { onMount } from 'svelte';
  import { extraisSegmentsDuFragment } from './fragmentDeNavigation.svelte';

  type Lien = { emoji?: string; label: string; fragment: string };
  type Props = {
    liens: Lien[];
    lienActif: string;
    centré?: boolean;
  };

  let { liens, lienActif = $bindable(), centré }: Props = $props();

  const changeLeLienCourant = () => {
    const [section] = extraisSegmentsDuFragment(window.location.hash);
    if (section) {
      lienActif = liens.find((lien) => lien.fragment === `#${section}`)?.fragment ?? liens[0].fragment;
    }
  };

  onMount(() => {
    changeLeLienCourant();
    window.addEventListener('hashchange', changeLeLienCourant);
    return () => window.removeEventListener('hashchange', changeLeLienCourant);
  });
</script>

<dsfr-tabnav
  centered={centré}
  links={enPropriétéWebC(
    liens.map((lien) => ({ label: `${lien.emoji ? lien.emoji + ' ' : ''}${lien.label}`, href: lien.fragment }))
  )}
  activeIndex={liens.findIndex((lien) => lien.fragment === lienActif)}
>
</dsfr-tabnav>
