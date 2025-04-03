<script lang="ts">
  import ChampTexte from '../ui/ChampTexte.svelte';
  import Bouton from '../ui/Bouton.svelte';
  import axios from 'axios';
  let email: string;
  let enCoursEnvoi = false;

  const soumetFormulaire = () => {
    enCoursEnvoi = true;
    try {
      axios.post('/api/mon-aide-cyber/demandes-aide', { email });
    } finally {
      enCoursEnvoi = false;
    }
  };
</script>

<section class="test-maturite">
  <div class="contenu-section">
    <h2>Le diagnostic</h2>
    <div class="formulaire">
      <label for="email">Votre email</label>
      <ChampTexte
        bind:valeur={email}
        nom="email"
        id="email"
        aideSaisie="Ex: jean.dupont@email.com"
      />
    </div>
    <Bouton
      type="primaire"
      titre="Envoyer"
      on:click={soumetFormulaire}
      {enCoursEnvoi}
    />
  </div>
</section>
