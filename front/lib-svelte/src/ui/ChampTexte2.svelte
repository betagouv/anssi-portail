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
    valeur?: string;
    type?: 'text' | 'email';
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
    type = 'text',
    valeur = $bindable(),
  }: Props = $props();
</script>

<dsfr-input
  {id}
  disabled={desactive}
  errorMessage={messageErreur}
  hint={sousTitre}
  label={libelle}
  name={nom}
  onvaluechanged={(e: CustomEvent) => (valeur = e.detail)}
  pattern={modele}
  placeholder={aideSaisie}
  required={requis}
  {type}
  value={valeur}
></dsfr-input>
