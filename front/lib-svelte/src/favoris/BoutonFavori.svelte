<script lang="ts">
  import axios from 'axios';
  import type { IdItem } from '../catalogue/Catalogue.types';
  import { favorisStore } from '../stores/favoris.store';
  import { profilStore } from '../stores/profil.store';
  import Bouton from '../ui/Bouton.svelte';

  export let idItem: IdItem;
  export let avecTexte: boolean = false;
  export let taille: 'sm' | 'md' = 'md';
  export let avecBordure: boolean = false;

  $: estFavori = $favorisStore.includes(idItem);
  $: libelle = estFavori ? 'Retirer le favori' : 'Ajouter en favori';
  $: titre = $profilStore ? '' : 'Connectez-vous pour profiter des favoris';
  $: icone = estFavori ? 'heart-fill' : 'heart-line';
  $: iconeSeule = !avecTexte || !$profilStore;
  $: type = (avecBordure ? 'tertiaire' : 'tertiaire-sans-bordure') as 'tertiaire' | 'tertiaire-sans-bordure';

  const actionSurClick = async () => {
    const idFavori = idItem;
    if (!$profilStore) return;

    try {
      if (estFavori) {
        await axios.delete(`/api/favoris/${encodeURIComponent(idFavori)}`);
        favorisStore.retire(idFavori);
      } else {
        await axios.post('/api/favoris', { idItemCyber: idFavori });
        favorisStore.ajoute(idFavori);
      }
    } catch (error) {
      console.error('API indisponible', error);
    }
  };
</script>

<Bouton {libelle} {titre} {iconeSeule} {icone} {type} surClic={actionSurClick} {taille} />
