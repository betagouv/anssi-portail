<script lang="ts">
  let lienTest = window.location.href;
  let urlLinkedIn = `https://www.linkedin.com/shareArticle?url=${lienTest}&title=Test de maturité Cyber`;
  const partageLinkedIn = () => {
    window.open(
      urlLinkedIn,
      'Partager sur LinkedIn',
      'toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=550,height=550'
    );
  };

  const partageLien = () => {
    navigator.clipboard.writeText(window.location.href).then(function () {
      alert('Adresse copiée dans le presse papier.');
    });
  };
</script>

<section class="partage-test">
  <div class="contenu-section">
    <div class="description">
      <h2>Encouragez d’autres organisations à agir</h2>
      <p>
        Aidez d’autres organisations à accéder à des services et ressources
        adaptés à leur maturité cyber.
      </p>
    </div>
    <div class="partage">
      <h3>Partager</h3>
      <div class="boutons-partage">
        <a
          class="bouton secondaire"
          target="_blank"
          rel="noopener"
          title="Partager sur LinkedIn"
          on:click|preventDefault={partageLinkedIn}
          href={urlLinkedIn}
        >
          <img
            src="/assets/images/icone-linkedin.svg"
            alt="Partager sur LinkedIn"
          />
        </a>

        <a
          class="bouton secondaire"
          target="_blank"
          rel="noopener external"
          title="Partager par email"
          href="mailto:?subject=Test de maturité Cyber&body=Lien vers le test : {lienTest}"
        >
          <img src="/assets/images/icone-email.svg" alt="Partager par email" />
        </a>

        <button class="bouton secondaire" on:click={partageLien}>
          <img
            src="/assets/images/icone-copie-lien.svg"
            alt="Copier dans le presse-papier"
          />
        </button>
      </div>
    </div>
  </div>
</section>
