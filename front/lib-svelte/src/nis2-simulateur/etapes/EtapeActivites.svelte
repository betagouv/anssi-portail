<script lang="ts">
  import Etape from './Etape.svelte';
  import { TitresEtapes } from './TitresEtapes';
  import PrecedentSuivant from './PrecedentSuivant.svelte';
  import type { SecteurSimple } from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.definitions';
  import { libellesSecteursActivite } from '../../../../../back/src/metier/nis2-simulateur/LibellesSecteursActivite';
  import { secteurDe } from '../../../../../back/src/metier/nis2-simulateur/SousSecteurActivite.operations';
  import { SvelteMap, SvelteSet } from 'svelte/reactivity';
  import type { SousSecteurActivite } from '../../../../../back/src/metier/nis2-simulateur/SousSecteurActivite.definitions';
  import type { Activite } from '../../../../../back/src/metier/nis2-simulateur/Activite.definitions';
  import { libellesSousSecteursActivite } from '../../../../../back/src/metier/nis2-simulateur/LibellesSousSecteursActivite';
  import { activitesParSecteurEtSousSecteur } from '../../../../../back/src/metier/nis2-simulateur/Activite.operations';
  import { libellesActivites } from '../../../../../back/src/metier/nis2-simulateur/LibellesActivites';
  import DescriptionActivite from './DescriptionActivite.svelte';
  import { listeDescriptionsActivites } from '../../../../../back/src/metier/nis2-simulateur/ListeDescriptionsActivites';
  import { clic } from '../../directives/actions.svelte';

  type SecteurAvecActivite = SecteurSimple | SousSecteurActivite;

  function libelleSecteurOuSousSecteur(s: SecteurAvecActivite) {
    const estSousSecteur = Object.keys(libellesSousSecteursActivite).includes(
      s
    );

    if (!estSousSecteur) return libellesSecteursActivite[s as SecteurSimple];

    const secteurAssocie = secteurDe(s as SousSecteurActivite);
    const racine = libellesSecteursActivite[secteurAssocie];
    const detail = libellesSousSecteursActivite[s as SousSecteurActivite];
    return `${racine} / ${detail}`;
  }

  function unSecteurEstSansReponse(
    reponse: SvelteMap<SecteurAvecActivite, Activite[]>,
    secteursAttendus: SecteurAvecActivite[]
  ) {
    const choixActivites: Activite[][] = [...reponse.values()];
    if (choixActivites.length !== secteursAttendus.length) return true;
    return choixActivites.some((sousSecteur) => sousSecteur.length === 0);
  }

  interface Props {
    secteursChoisis: SecteurAvecActivite[];
    onsuivant: (reponse: Activite[]) => void;
  }

  let props: Props = $props();

  let reponse: SvelteMap<SecteurAvecActivite, Activite[]> = new SvelteMap<
    SecteurAvecActivite,
    Activite[]
  >();
  let descriptionsVisibles: SvelteSet<Activite> = new SvelteSet<Activite>();

  const choisis =
    (_secteur: string, _activite: string) => (e: { detail: boolean }) => {
      const checked = e.detail;
      const secteur = _secteur as SecteurAvecActivite;
      const activite = _activite as Activite;

      if (checked) {
        if (!reponse.has(secteur)) reponse.set(secteur, [activite]);
        else reponse.set(secteur, [...reponse.get(secteur)!, activite]);
      } else {
        reponse.set(
          secteur,
          reponse.get(secteur)!.filter((i) => i !== activite)
        );
      }
    };

  const valide = () => {
    const toutesLesActivites = [...reponse.values()].flat();
    props.onsuivant(toutesLesActivites);
  };
</script>

<Etape>
  <dsfr-stepper
    title={TitresEtapes['activites']}
    current-step="6"
    step-count="6"
    hide-details="true"
  ></dsfr-stepper>

  <p>
    Quelles sont les activités pratiquées dans les secteurs sélectionnés&nbsp;?
  </p>

  <dsfr-highlight
    size="sm"
    text="Cliquez sur les info-bulles pour obtenir plus d’informations sur les définitions des activités."
  ></dsfr-highlight>

  {#each props.secteursChoisis as s (s)}
    <div>
      <p><b>{libelleSecteurOuSousSecteur(s)}</b></p>
      {#each activitesParSecteurEtSousSecteur[s] as activite (activite)}
        {@const avecDescription =
          listeDescriptionsActivites[activite].length > 0}

        <div class="ligne-activite">
          <div class="etage-checkbox">
            <dsfr-checkbox
              id={`checkbox-${s}-${activite}`}
              size="sm"
              label={libellesActivites[activite]}
              onvaluechanged={choisis(s, activite)}
            ></dsfr-checkbox>
            {#if avecDescription}
              <lab-anssi-icone
                nom="information-line"
                taille="sm"
                use:clic={() => {
                  if (descriptionsVisibles.has(activite))
                    descriptionsVisibles.delete(activite);
                  else descriptionsVisibles.add(activite);
                }}
              ></lab-anssi-icone>
            {/if}
          </div>

          {#if avecDescription && descriptionsVisibles.has(activite)}
            <div class="description-activite">
              <DescriptionActivite {activite} />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}

  <PrecedentSuivant
    message="Sélectionnez au moins une réponse par secteur"
    onsuivant={valide}
    suivantdisabled={unSecteurEstSansReponse(reponse, props.secteursChoisis)}
  />
</Etape>

<style lang="scss">
  .ligne-activite {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 28px;
    }

    .etage-checkbox {
      display: flex;
      flex-direction: row;
      gap: 12px;
      justify-content: space-between;
      align-items: start;

      lab-anssi-icone {
        cursor: pointer;
      }
    }

    .description-activite {
      margin-top: 12px;
    }
  }
</style>
