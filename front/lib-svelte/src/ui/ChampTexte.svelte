<script lang="ts">
  type Props = {
    aideSaisie?: string;
    desactive?: boolean;
    id: string;
    libelle: string;
    messageErreur?: string;
    modele?: string;
    nom: string;
    requis?: boolean;
    sousTitre?: string;
    tailleMaximale?: number;
    type?: 'text' | 'email';
    valeur?: string;
    statut?: 'default' | 'valid' | 'error' | 'info';
    oninput?: () => void;
    autocomplete?: string;
  };
  let {
    aideSaisie,
    autocomplete,
    desactive,
    id,
    libelle,
    messageErreur,
    modele,
    nom,
    requis,
    sousTitre,
    tailleMaximale,
    type = 'text',
    valeur = $bindable(),
    statut = $bindable(),
    oninput,
  }: Props = $props();

  const onvaluechanged = (e: CustomEvent) => {
    valeur = e.detail;
    if (oninput) {
      oninput();
    }
  };
</script>

<dsfr-input
  {id}
  disabled={desactive}
  errorMessage={messageErreur}
  hint={sousTitre}
  label={libelle}
  maxlength={tailleMaximale}
  name={nom}
  {onvaluechanged}
  pattern={modele}
  placeholder={aideSaisie}
  required={requis}
  {type}
  value={valeur}
  status={statut}
  {autocomplete}
></dsfr-input>
