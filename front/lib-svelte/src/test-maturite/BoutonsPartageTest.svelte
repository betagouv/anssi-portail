<script lang="ts">
  import Bouton from '../ui/Bouton.svelte';
  import Lien from '../ui/Lien.svelte';

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
      alert('Adresse copiée dans le presse-papier.');
    });
  };
</script>

<div class="boutons-partage">
  <Bouton
    titre="Partager sur LinkedIn"
    surClic={partageLinkedIn}
    type="secondaire"
    iconeSeule
    icone="linkedin-box-fill"
  />
  <Lien
    href="mailto:?subject=Test de maturité Cyber&body=Lien vers le test : {lienTest}"
    libelle="Partager par email"
    apparence="bouton"
    type="secondaire"
    icone="mail-fill"
    iconeSeule
  />

  <Bouton type="secondaire" icone="links-line" iconeSeule surClic={partageLien} />
</div>

<style lang="scss">
  .boutons-partage {
    padding: 0;
    display: flex;
    gap: 16px;
  }
</style>
