<script lang="ts">
  import Etape from './Etape.svelte';
  import { TitresEtapes } from './TitresEtapes';
  import PrecedentSuivant from './PrecedentSuivant.svelte';
  import type {
    SecteurActivite,
    SecteurComposite,
  } from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.definitions';
  import type { SousSecteurActivite } from '../../../../../back/src/metier/nis2-simulateur/SousSecteurActivite.definitions';
  import { libellesSousSecteursActivite } from '../../../../../back/src/metier/nis2-simulateur/LibellesSousSecteursActivite';
  import { sousSecteursParSecteur } from '../../../../../back/src/metier/nis2-simulateur/SousSecteurActivite.valeurs';
  import { SvelteMap } from 'svelte/reactivity';
  import { libellesSecteursActivite } from '../../../../../back/src/metier/nis2-simulateur/LibellesSecteursActivite';

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

  let props: Props = $props();

  let reponse: SvelteMap<SecteurActivite, SousSecteurActivite[]> = new SvelteMap<
    SecteurActivite,
    SousSecteurActivite[]
  >();

  const choisis = (_secteur: string, _sousSecteur: string) => (e: { detail: boolean }) => {
    const checked = e.detail;
    const secteur = _secteur as SecteurActivite;
    const sousSecteur = _sousSecteur as SousSecteurActivite;

    if (checked) {
      if (!reponse.has(secteur)) reponse.set(secteur, [sousSecteur]);
      else reponse.set(secteur, [...reponse.get(secteur)!, sousSecteur]);
    } else {
      reponse.set(
        secteur,
        reponse.get(secteur)!.filter((sous) => sous !== sousSecteur)
      );
    }
  };

  const valide = () => {
    const tousLesSousSecteurs = [...reponse.values()].flat();
    props.onsuivant(tousLesSousSecteurs);
  };
</script>

<Etape>
  <dsfr-stepper title={TitresEtapes['sousSecteursActivite']} current-step="5" step-count="6" hide-details="true"
  ></dsfr-stepper>

  <p>Précisez les sous-secteurs concernés :</p>

  {#each props.secteursChoisis as s (s)}
    <div>
      <p><b>{libellesSecteursActivite[s]}</b></p>
      {#each recupereSousSecteursDe(s) as sousSecteur (sousSecteur)}
        <dsfr-checkbox
          id={`checkbox-${s}-${sousSecteur}`}
          size="sm"
          label={libellesSousSecteursActivite[sousSecteur]}
          onvaluechanged={choisis(s, sousSecteur)}
        ></dsfr-checkbox>
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
  dsfr-checkbox {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 28px;
    }
  }
</style>
