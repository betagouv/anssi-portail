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
  };
  let {
    aideSaisie,
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
  }: Props = $props();
</script>

<dsfr-input
  {id}
  disabled={desactive}
  errorMessage={messageErreur}
  hint={sousTitre}
  label={libelle}
  maxlength={tailleMaximale}
  name={nom}
  onvaluechanged={(e: CustomEvent) => (valeur = e.detail)}
  pattern={modele}
  placeholder={aideSaisie}
  required={requis}
  {type}
  value={valeur}
  status={statut}
></dsfr-input>
