<script lang="ts">
  import { getContext, untrack } from 'svelte';
  import Bouton from '../ui/Bouton.svelte';
  import Lien from '../ui/Lien.svelte';

  const { cheminPartagé, sujetMail }: { cheminPartagé: string; sujetMail: string } = $props();

  const location = getContext<Window['location'] | undefined>('location');

  const { protocol, host } = location ?? window.location;
  const lienPage = `${protocol}//${host}${untrack(() => cheminPartagé)}`;
  const urlLinkedIn = `https://www.linkedin.com/sharing/share-offsite?url=${lienPage}`;

  const partageLinkedIn = () => {
    window.open(
      urlLinkedIn,
      'Partager sur LinkedIn',
      'toolbar=no,location=yes,status=no,menubar=no,scrollbars=yes,resizable=yes,width=550,height=550'
    );
  };

  const partageLien = () => {
    navigator.clipboard.writeText(lienPage).then(function () {
      alert('Adresse copiée dans le presse-papier.');
    });
  };
</script>

<div class="partage">
  <p class="texte-standard-md">Partager la page</p>
  <div class="boutons-partage">
    <Bouton
      titre="Partager sur LinkedIn"
      surClic={partageLinkedIn}
      type="tertiaire"
      iconeSeule
      icone="linkedin-box-line"
    />
    <Lien
      href={`mailto:?subject=${sujetMail}&body=Lien : ${lienPage}`}
      libelle="Partager par email"
      apparence="bouton"
      type="tertiaire"
      icone="mail-line"
      iconeSeule
    />

    <Bouton type="tertiaire" icone="links-line" iconeSeule surClic={partageLien} />
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .partage {
    @include a-partir-de(lg) {
      width: 282px;
    }

    .texte-standard-md {
      margin-bottom: 1rem;
    }

    .boutons-partage {
      padding: 0;
      display: flex;
      gap: 16px;
    }
  }
</style>
