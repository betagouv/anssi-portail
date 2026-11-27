<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';

  import CaseACocher from '@ui/CaseACocher.svelte';

  import { libellesSecteursActivite } from '../../../../../back/src/metier/nis2-simulateur/LibellesSecteursActivite';
  import { libellesSousSecteursActivite } from '../../../../../back/src/metier/nis2-simulateur/LibellesSousSecteursActivite';
  import type {
    SecteurActivite,
    SecteurComposite,
  } from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.definitions';
  import type { SousSecteurActivite } from '../../../../../back/src/metier/nis2-simulateur/SousSecteurActivite.definitions';
  import { sousSecteursParSecteur } from '../../../../../back/src/metier/nis2-simulateur/SousSecteurActivite.valeurs';
  import Etape from './Etape.svelte';
  import PrecedentSuivant from './PrecedentSuivant.svelte';
  import { TitresEtapes } from './TitresEtapes';

  function recupereSousSecteursDe(secteur: SecteurComposite): SousSecteurActivite[] {
    return [secteur, sousSecteursParSecteur[secteur]][1] as SousSecteurActivite[];
  }

  function unSecteurEstSansReponse(
    reponse: SvelteMap<SecteurActivite, SousSecteurActivite[]>,
    secteursAttendus: SecteurComposite[]
  ) {
    const sousSecteurs: SousSecteurActivite[][] = [...reponse.values()];
    if (sousSecteurs.length !== secteursAttendus.length) return true;
    return sousSecteurs.some((sousSecteur) => sousSecteur.length === 0);
  }

  interface Props {
    secteursChoisis: SecteurComposite[];
    onsuivant: (reponse: SousSecteurActivite[]) => void;
  }

  let { secteursChoisis, onsuivant }: Props = $props();

  let reponse: SvelteMap<SecteurActivite, SousSecteurActivite[]> = new SvelteMap<
    SecteurActivite,
    SousSecteurActivite[]
  >();

  const estChoisi = (secteur: SecteurActivite, sousSecteur: SousSecteurActivite) =>
    reponse.get(secteur)?.includes(sousSecteur) ?? false;

  const bascule = (secteur: SecteurActivite, sousSecteur: SousSecteurActivite) => {
    if (!estChoisi(secteur, sousSecteur)) {
      reponse.set(secteur, [...(reponse.get(secteur) ?? []), sousSecteur]);
    } else {
      reponse.set(
        secteur,
        reponse.get(secteur)!.filter((sous) => sous !== sousSecteur)
      );
    }
  };

  const valide = () => {
    const tousLesSousSecteurs = [...reponse.values()].flat();
    onsuivant(tousLesSousSecteurs);
  };
</script>

<Etape>
  <dsfr-stepper title={TitresEtapes['sousSecteursActivite']} current-step="5" step-count="6" hide-details="true"
  ></dsfr-stepper>

  <p>Précisez les sous-secteurs concernés&nbsp;:</p>

  {#each secteursChoisis as s (s)}
    <div>
      <p><b>{libellesSecteursActivite[s]}</b></p>
      {#each recupereSousSecteursDe(s) as sousSecteur (sousSecteur)}
        <div class="case">
          <CaseACocher
            id={`checkbox-${s}-${sousSecteur}`}
            taille="sm"
            libellé={libellesSousSecteursActivite[sousSecteur]}
            coché={estChoisi(s, sousSecteur)}
            surChangement={() => bascule(s, sousSecteur)}
          />
        </div>
      {/each}
    </div>
  {/each}

  <PrecedentSuivant
    message="Sélectionnez au moins une réponse par secteur"
    onsuivant={valide}
    suivantdisabled={unSecteurEstSansReponse(reponse, secteursChoisis)}
  />
</Etape>

<style lang="scss">
  .case {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 28px;
    }
  }
</style>
