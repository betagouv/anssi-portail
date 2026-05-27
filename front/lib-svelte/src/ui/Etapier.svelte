<script lang="ts">
  type Props = {
    etapeCourante: number;
    nombreEtapes: number;
    titreEtapeCourante: string;
    titreEtapeSuivante?: string;
    niveauTitre?: number;
    cacheTitreEtapeSuivante?: boolean;
  };

  const {
    etapeCourante,
    nombreEtapes,
    titreEtapeCourante,
    titreEtapeSuivante = '',
    niveauTitre = 2,
    cacheTitreEtapeSuivante = false,
  }: Props = $props();
</script>

<dsfr-stepper
  currentStep={etapeCourante}
  stepCount={nombreEtapes}
  level={niveauTitre}
  title={titreEtapeCourante}
  nextStep={titreEtapeSuivante}
  hideDetails={cacheTitreEtapeSuivante}
>
</dsfr-stepper>
