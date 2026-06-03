<script lang="ts">
  import Heros from '../ui/Heros.svelte';
  import GrilleCartesMesures from './GrilleCartesMesures.svelte';
  import Progression from './Progression.svelte';

  const mesure = {
    id: 'CONTINU.1',
    phrase_accroche: 'Évitez de tout perdre en cas de cyberattaque 😩',
    titre: 'Sauvegarder régulièrement les données, vérifier et protéger ces sauvegardes.',
  };
  const mesure2 = {
    id: 'AUTH.5',
    phrase_accroche: 'Empêchez qu’un compte soit utilisé, même si le mot de passe a fuité 💨',
    titre:
      "Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l'accès aux comptes ",
  };

  const mesures = [mesure, mesure2];
  const idMesuresMisesEnAvant = ['CONTINU.1'];
  const mesuresMisesEnAvant = $derived(mesures.filter((m) => idMesuresMisesEnAvant.includes(m.id)));
  const autresMesures = $derived(mesures.filter((m) => !idMesuresMisesEnAvant.includes(m.id)));
</script>

<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description="Avancez à votre rythme dans une première démarche de sécurisation et appliquez les recommandations essentielles pour réduire les risques cyber du quotidien."
  format="details"
  illustrationAlt=""
  illustrationSource=""
  titre="Cyberdépart : agir pour votre cybersécurité"
  theme="sombre"
></Heros>

<dsfr-container class="progression">
  <Progression></Progression>
</dsfr-container>

<dsfr-container class="actions-en-avant">
  <h4>🚀 Lancez-vous avec ces premières actions</h4>
  <GrilleCartesMesures mesures={mesuresMisesEnAvant}></GrilleCartesMesures>
</dsfr-container>

<dsfr-container class="autres-actions">
  <GrilleCartesMesures mesures={autresMesures}></GrilleCartesMesures>
</dsfr-container>

<style lang="scss">
  dsfr-container.progression {
    padding-block: 2rem;
  }

  dsfr-container.actions-en-avant {
    background-color: var(--background-alt-blue-france);
    padding-block: 3rem;

    h4 {
      margin-bottom: 2rem;
    }
  }

  .autres-actions {
    padding-block: 3rem;
  }
</style>
