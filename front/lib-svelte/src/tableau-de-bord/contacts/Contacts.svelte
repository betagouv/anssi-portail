<script lang="ts">
  import { calculeCodeSecteurContact } from '@anssi-portail/contacts-sectoriels';
  import { DsfrTabs } from '@lab-anssi/ui-kit';
  import axios from 'axios';
  import { onMount, type ComponentProps } from 'svelte';
  import CarteContactCampus from '../../contacts/CarteContactCampus.svelte';
  import CarteContactCOT from '../../contacts/CarteContactCOT.svelte';
  import CarteContactCSIRT from '../../contacts/CarteContactCSIRT.svelte';
  import CarteContactNational from '../../contacts/CarteContactNational.svelte';
  import CarteContactSectoriel from '../../contacts/CarteContactSectoriel.svelte';
  import {
    estCodeRegion,
    type ContactNational,
    type ContactSectoriel,
    type ContactsInitiaux,
    type ContactsRegionaux,
  } from '../../contacts/contacts.type';
  import { profilStore } from '../../stores/profil.store';
  import TitreDeSection from '../TitreDeSection.svelte';
  import CarteContactTableauDeBord from './CarteContactTableauDeBord.svelte';
  import PanneauContacts from './PanneauContacts.svelte';

  const tabs: ComponentProps<typeof DsfrTabs>['tabs'] = ['sectoriels', 'régionaux', 'nationaux'].map((id) => ({
    id,
    label: '',
    content: '',
  }));

  let contactsInitiaux = $state<ContactsInitiaux>();

  onMount(async () => {
    try {
      const { data } = await axios.get<ContactsInitiaux>('/api/contacts');
      contactsInitiaux = data;
    } catch {
      contactsInitiaux = undefined;
    }
  });

  const codeSecteur = $derived(calculeCodeSecteurContact($profilStore?.codeActivite));
  const contactSectoriel: ContactSectoriel | undefined = $derived(
    codeSecteur ? contactsInitiaux?.sectoriels[codeSecteur] : undefined
  );

  const codeRégion = $derived($profilStore?.codeRegion);
  const contactsRégionaux: ContactsRegionaux | undefined = $derived(
    codeRégion && estCodeRegion(codeRégion) ? contactsInitiaux?.regionaux[codeRégion] : undefined
  );
  const contactCOT: ContactsRegionaux['COT'] = $derived(contactsRégionaux?.COT);
  const contactCampus: ContactsRegionaux['campus'] = $derived(contactsRégionaux?.campus);
  const contactCSIRT: ContactsRegionaux['CSIRT'] = $derived(contactsRégionaux?.CSIRT);
  const nombreContactsRégionaux = $derived(
    [contactCOT, contactCSIRT, contactCampus].filter((prédicat) => !!prédicat).length
  );

  const contactsNationaux: ContactNational[] = $derived(contactsInitiaux?.nationaux ?? []);

  let indexTabActivée = $derived(contactSectoriel ? 0 : nombreContactsRégionaux > 0 ? 1 : 2);

  const surChangementDeTab = ({ detail }: { detail: { index: number } }) => {
    indexTabActivée = detail.index;
  };
</script>

<div class="contacts">
  <TitreDeSection libellé="Les contacts cyber pour vous guider" icône="customer-service-line" />

  <dsfr-tabs {tabs} active-tab-index={indexTabActivée} ontabchanged={surChangementDeTab}>
    <div slot="tab-1">
      Contacts sectoriels <span class="tab-tag" class:actif={indexTabActivée === 0}>
        <span>{contactSectoriel ? 1 : 0}</span>
      </span>
    </div>
    <div slot="tab-2">
      Contacts régionaux <span class="tab-tag" class:actif={indexTabActivée === 1}>
        <span>{nombreContactsRégionaux}</span>
      </span>
    </div>
    <div slot="tab-3">
      Contacts nationaux <span class="tab-tag" class:actif={indexTabActivée === 2}>
        <span>{contactsNationaux.length}</span>
      </span>
    </div>
    <div slot="panel-1">
      <PanneauContacts>
        {#if contactSectoriel}
          <CarteContactSectoriel modèle={CarteContactTableauDeBord} contact={contactSectoriel} />
        {/if}
      </PanneauContacts>
    </div>
    <div slot="panel-2">
      <PanneauContacts>
        {#if contactsRégionaux && contactCOT}
          <CarteContactCOT
            modèle={CarteContactTableauDeBord}
            contact={contactCOT}
            désignation={contactsRégionaux.designation}
          />
        {/if}
        {#if contactCSIRT}
          <CarteContactCSIRT modèle={CarteContactTableauDeBord} contact={contactCSIRT} />
        {/if}
        {#if contactCampus}
          <CarteContactCampus modèle={CarteContactTableauDeBord} contact={contactCampus} />
        {/if}
      </PanneauContacts>
    </div>
    <div slot="panel-3">
      <PanneauContacts>
        {#each contactsNationaux as contactNational (contactNational.nom)}
          <CarteContactNational modèle={CarteContactTableauDeBord} contact={contactNational} />
        {/each}
      </PanneauContacts>
    </div>
  </dsfr-tabs>
</div>

<style lang="scss">
  .contacts {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .tab-tag {
      display: inline-grid;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      vertical-align: middle;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.2rem;
      color: var(--text-action-high-grey, #161616);
      background: var(--_background-default-grey, #fff);

      &.actif {
        color: var(--text-inverted-grey, #fff);
        background: var(--background-active-blue-france, #000091);
      }

      > span {
        transform: translateY(-1px);
      }
    }
  }
</style>
