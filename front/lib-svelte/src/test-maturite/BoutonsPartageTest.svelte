<script lang="ts">
  const { protocol, host } = window.location;
  const lienTest = `${protocol}://${host}/test-maturite`;
  const urlLinkedIn = `https://www.linkedin.com/shareArticle?url=${lienTest}&title=Test de maturité Cyber`;

  const partageLinkedIn = () => {
    window.open(
      urlLinkedIn,
      'Partager sur LinkedIn',
      'toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=550,height=550'
    );
  };

  const partageLien = () => {
    navigator.clipboard.writeText(lienTest).then(function () {
      alert('Adresse copiée dans le presse papier.');
    });
  };
</script>

<div class="boutons-partage">
  <a
    class="bouton secondaire"
    target="_blank"
    rel="noopener"
    title="Partager sur LinkedIn"
    on:click|preventDefault={partageLinkedIn}
    href={urlLinkedIn}
  >
    <img src="/assets/images/icone-linkedin.svg" alt="Partager sur LinkedIn" />
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

<style lang="scss">
  .boutons-partage {
    padding: 0;
    display: flex;
    gap: 16px;

    a {
      &:after {
        display: none;
      }
    }

    .bouton {
      padding: 8px;
    }
  }
</style>
