<script lang="ts">
  import { DsfrContainer } from '@lab-anssi/ui-kit';
  import { profilStore } from '../stores/profil.store';
  import Lien from '../ui/Lien.svelte';
  import AutresRessources from './AutresRessources.svelte';
  import Contacts from './Contacts.svelte';
  import Favoris from './Favoris.svelte';
  import Financements from './Financements.svelte';
  import Parcours from './parcours/Parcours.svelte';
  import TestsCyber from './tests-cyber/TestsCyber.svelte';
</script>

<div class="conteneur-externe">
  <DsfrContainer>
    <div class="conteneur-interne">
      <h1>Bonjour {$profilStore?.prenom},</h1>

      <Parcours />

      <Contacts />

      <Financements />

      <TestsCyber />

      <Favoris />

      <AutresRessources />

      <Lien libelle="Haut de page" href="#" taille="md" icone="arrow-up-fill" />
    </div>
  </DsfrContainer>
</div>

<style lang="scss">
  h1 {
    margin: 0;
  }
  .conteneur-externe {
    padding: 4.5rem 0;
    background-color: var(--background-alt-beige-gris-galet, #f9f6f2);

    .conteneur-interne {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
  }
</style>
