<script lang="ts">
  import { onMount } from 'svelte';

  let cibleAbonnementInfolettre = $state('');

  const changeLAdresseDeRetour = () => {
    const url = new URL(window.location.href);
    const adresseRetour = encodeURIComponent(
      url.pathname + url.search + url.hash
    );
    cibleAbonnementInfolettre = `/abonnement-infolettre?adresseRetour=${adresseRetour}`;
  };

  onMount(() => {
    changeLAdresseDeRetour();
  });

  $effect(() => {
    window.addEventListener('hashchange', changeLAdresseDeRetour);
    return () =>
      window.removeEventListener('hashchange', changeLAdresseDeRetour);
  });
</script>

<p class="note-information">
  <strong>Newsletter MesServicesCyber.</strong>
  Restez informé des nouveaux guides de l’ANSSI et autres actualités MesServicesCyber.
  <lab-anssi-lien href={cibleAbonnementInfolettre} titre="S’abonner"
  ></lab-anssi-lien>
</p>

<style lang="scss">
  .note-information {
    color: var(--gris-aide-saisie);
    font-size: 1rem;
    line-height: 1.5rem;
    margin-bottom: 1.5rem;
  }
</style>
