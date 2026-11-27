<script lang="ts">
  import { tick } from 'svelte';

  import { peintUnQRCode } from '@plateforme/qrcode';
  import Bouton from '@ui/Bouton.svelte';
  import Lien from '@ui/Lien.svelte';
  import Modale from '@ui/Modale.svelte';
  import { copieDansLePressePapier } from '@ui/presse-papier';

  import type { ReponseCreationSessionGroupe } from './SessionGroupe';

  let codeSession = $state<string>('');
  let canvas = $state<HTMLCanvasElement>();
  let lienPourParticipants = $state<string>('');

  let modaleEstOuverte = $state(false);

  export const ouvre = async ({ code, lienParticipant }: ReponseCreationSessionGroupe) => {
    codeSession = code;
    lienPourParticipants = lienParticipant;
    modaleEstOuverte = true;
    await tick();
    await peintUnQRCode(canvas, lienParticipant, { width: 148, margin: 0 });
  };

  const ferme = () => {
    modaleEstOuverte = false;
  };

  let codeSessionFormate = $derived(codeSession && codeSession.slice(0, 3) + '-' + codeSession.slice(3));

  const copieLienParticipant = async () => {
    const copié = await copieDansLePressePapier(lienPourParticipants);
    alert(copié ? 'Lien participant copié dans le presse-papier.' : 'Échec de la copie dans le presse-papier.');
  };

  let lienPourOrganisateur = $derived(
    `${window.location.origin}/test-maturite?session-groupe=${codeSession}&organisateur`
  );

  const copieLienOrganisateur = async () => {
    const copié = await copieDansLePressePapier(lienPourOrganisateur);
    alert(copié ? 'Lien organisateur copié dans le presse-papier.' : 'Échec de la copie dans le presse-papier.');
  };
</script>

<Modale bind:estOuverte={modaleEstOuverte} titre="Nouvelle session de groupe" icone="team-fill">
  <div class="information">
    <p>
      Partagez ce code ou le QR code aux participants pour leur permettre d’accéder à la session de test de maturité
      cyber. Ce code est unique et valable pour cette session uniquement.
    </p>
  </div>
  <div class="qrcode">
    <canvas bind:this={canvas}></canvas>
    <div>
      <p class="texte-standard-md">Code de session</p>
      <h2 class="code">{codeSessionFormate}</h2>
      <Bouton
        libelle="Copier le lien participant"
        titre="Copier dans le presse-papier le lien de participation à la session de groupe"
        taille="sm"
        type="tertiaire"
        icone="link"
        surClic={copieLienParticipant}
      />
    </div>
  </div>
  <div class="organisateur texte-detail-sm">
    <p>
      Copiez ce lien si vous souhaitez accéder à votre session organisateur ultérieurement&nbsp;:<br />
      <u>session-groupe={codeSession}&organisateur</u>
      <Bouton
        titre="Copier dans le presse-papier le lien organisateur de la session de groupe"
        taille="sm"
        type="tertiaire-sans-bordure"
        icone="link"
        iconeSeule
        surClic={copieLienOrganisateur}
      />
    </p>
  </div>
  {#snippet actions()}
    <Lien
      apparence="bouton"
      libelle="Débuter le test"
      titre="Débuter le test de maturité cyber en tant qu'organisateur"
      taille="md"
      href={`/test-maturite?session-groupe=${codeSession}&organisateur`}
      etire
    />
    <Bouton libelle="Annuler" titre="Annuler" type="secondaire" taille="md" surClic={ferme} etire />
  {/snippet}
</Modale>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  p {
    margin: 0 0 16px;
  }

  .information {
    margin-bottom: 24px;
  }

  .qrcode {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    gap: 0 24px;

    canvas {
      border: 1px solid var(--border-default-grey);
      border-radius: 8px;
      margin-bottom: 16px;
      padding: 16px;
      width: 148px;
      height: 148px;
    }

    .texte-standard-md {
      margin-bottom: 0;
    }

    .code {
      margin-bottom: 16px;
    }
  }

  @include a-partir-de(md) {
    .qrcode {
      flex-direction: row;
    }
  }
</style>
