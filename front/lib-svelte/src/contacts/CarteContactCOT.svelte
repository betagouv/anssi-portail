<script lang="ts">
  import CarteContact from './CarteContact.svelte';
  import type { ContactsRegionaux } from './contacts.type';
  import LigneContact from './LigneContact.svelte';

  type Props = {
    contact: NonNullable<ContactsRegionaux['COT']>;
    désignation: ContactsRegionaux['designation'];
  };
  const { contact, désignation }: Props = $props();
</script>

<CarteContact titre="Délégué(e)s ANSSI de votre {désignation}">
  <LigneContact type="nom" valeur={contact.nom} />
  <LigneContact type="email" valeur={contact.email} />
</CarteContact>
