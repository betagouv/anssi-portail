<script lang="ts">
  import { getContext, untrack } from 'svelte';
  import Bouton from '../ui/Bouton.svelte';
  import Lien from '../ui/Lien.svelte';
  import { copieDansLePressePapier } from '../ui/presse-papier';

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

  const partageLien = async () => {
    const copié = await copieDansLePressePapier(lienPage);
    alert(copié ? 'Adresse copiée dans le presse-papier.' : 'Échec de la copie dans le presse-papier.');
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
      href={`mailto:?subject=${sujetMail}&body=Lien\u00a0: ${lienPage}`}
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
      width: 152px;
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
