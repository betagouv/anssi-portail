<script lang="ts">
  import { DsfrTabs } from '@lab-anssi/ui-kit';
  import type { ComponentProps } from 'svelte';
  import CarteContactCampus from '../../contacts/CarteContactCampus.svelte';
  import CarteContactCOT from '../../contacts/CarteContactCOT.svelte';
  import CarteContactCSIRT from '../../contacts/CarteContactCSIRT.svelte';
  import CarteContactNational from '../../contacts/CarteContactNational.svelte';
  import CarteContactSectoriel from '../../contacts/CarteContactSectoriel.svelte';
  import type { ContactSectoriel } from '../../contacts/contacts.type';
  import TitreDeSection from '../TitreDeSection.svelte';
  import CarteContactTableauDeBord from './CarteContactTableauDeBord.svelte';
  import PanneauContacts from './PanneauContacts.svelte';

  const tabs: ComponentProps<typeof DsfrTabs>['tabs'] = ['sectoriels', 'régionaux', 'nationaux'].map((id) => ({
    id,
    label: '',
    content: '',
  }));

  let indexTabActivée = $state(0);

  const surChangementDeTab = ({ detail }: { detail: { index: number } }) => {
    indexTabActivée = detail.index;
  };
  const contactSectoriel: ContactSectoriel = {
    nom: 'CERT Santé',
    siteWeb: 'https://cyberveille.esante.gouv.fr/',
  };

  const cot = { nom: 'Guillaume CRÉPIN', email: 'ile-de-france@ssi.gouv.fr' };
  const campus = {
    adresse: '5-7 rue Bellini 92800 La Défense',
    nom: 'Le Campus Cyber',
    siteWeb: 'https://campuscyber.fr/',
  };
  const csirt = {
    nom: 'Urgence Cyber Île-de-France',
    siteWeb: 'https://urgencecyber.iledefrance.fr/',
    adresse: '2, rue Simone Veil 93400 Saint-Ouen-sur-Seine',
    telephone: '0 800 730 647',
  };
  const contactsNationaux = [
    {
      nom: '17 Cyber',
      description:
        'Le 17cyber propose aux particuliers et aux autres entités, un diagnostic permettant d’obtenir des recommandations en cas d’incident et d’être mis en relation avec un policier, un gendarme, un prestataire ou un CSIRT territorial.',
      fonction: 'Police nationale, la Gendarmerie et Cybermalveillance.gouv.fr',
      lienPrincipal: { libelle: 'Aller sur le 17Cyber', href: 'https://www.cybermalveillance.gouv.fr/diagnostic' },
      téléphone: '17 (France) ou 112 (Europe)',
    },
  ];
</script>

<div class="contacts">
  <TitreDeSection libellé="Les contacts cyber pour vous guider" icône="customer-service-line" />

  <dsfr-tabs {tabs} active-tab-index={indexTabActivée} ontabchanged={surChangementDeTab}>
    <div slot="tab-1">
      Contacts sectoriels <span class="tab-tag" class:actif={indexTabActivée === 0}><span>1</span></span>
    </div>
    <div slot="tab-2">
      Contacts régionaux <span class="tab-tag" class:actif={indexTabActivée === 1}><span>30</span></span>
    </div>
    <div slot="tab-3">
      Contacts nationaux <span class="tab-tag" class:actif={indexTabActivée === 2}><span>4</span></span>
    </div>
    <div slot="panel-1">
      <PanneauContacts>
        <CarteContactSectoriel modèle={CarteContactTableauDeBord} contact={contactSectoriel} />
      </PanneauContacts>
    </div>
    <div slot="panel-2">
      <PanneauContacts>
        <CarteContactCOT modèle={CarteContactTableauDeBord} contact={cot} désignation="région" />
        <CarteContactCSIRT modèle={CarteContactTableauDeBord} contact={csirt} />
        <CarteContactCampus modèle={CarteContactTableauDeBord} contact={campus} />
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
