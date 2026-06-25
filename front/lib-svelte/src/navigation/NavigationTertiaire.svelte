<script lang="ts">
  import { onMount } from 'svelte';

  type Lien = { emoji?: string; label: string; fragment: string };
  type Props = {
    liens: Lien[];
    lienActif: string;
  };

  let { liens, lienActif = $bindable() }: Props = $props();

  const changeLeLienCourant = () => {
    const hash = new URLSearchParams(window.location.hash?.substring(1));
    const lienDansLUrl = Array.from(hash)[0];
    if (lienDansLUrl) {
      lienActif = liens.find((o) => o.fragment === `#${lienDansLUrl[0]}`)?.fragment ?? liens[0].fragment;
    }
  };

  onMount(() => {
    changeLeLienCourant();
  });

  $effect(() => {
    window.addEventListener('hashchange', changeLeLienCourant);
    return () => window.removeEventListener('hashchange', changeLeLienCourant);
  });

  let links: unknown = $derived.by(() => {
    if (typeof window === 'undefined') {
      return JSON.stringify(
        liens.map((lien) => ({
          label: `${lien.emoji ? lien.emoji + ' ' : ''}${lien.label}`,
          href: lien.fragment,
        }))
      );
    }
    return liens.map((lien) => ({
      label: `${lien.emoji ? lien.emoji + ' ' : ''}${lien.label}`,
      href: lien.fragment,
    }));
  });
</script>

<dsfr-tabnav centered {links} activeIndex={liens.findIndex((lien) => lien.fragment === lienActif)}> </dsfr-tabnav>
