<script lang="ts">
  import { decodeEntiteHtml } from '$plateforme/aseptisationDuHtml';
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { profilStore } from '../stores/profil.store.js';
  import type { Branche } from './filAriane';

  type Props = {
    feuille: string;
    branche?: Branche;
    brancheConnectee?: Branche;
    fondSombre?: boolean;
  };
  const { feuille, branche = undefined, brancheConnectee = undefined, fondSombre = false }: Props = $props();

  type Segment = {
    id: string;
    label: string;
    href: string;
  };
  const utilisateurEstConnecté = $derived(!!$profilStore);
  const convertiBrancheEnSegment = (branche?: Branche): Segment[] | undefined =>
    branche ? [{ id: `noeud-${branche.nom}`, label: branche.nom, href: branche.lien ?? '' }] : undefined;
  const segmentAccueil = $derived(
    utilisateurEstConnecté
      ? [{ id: 'noeud-catalogue', label: 'Guides et ressources', href: '/catalogue' }]
      : [{ id: 'noeud-accueil', label: 'Accueil', href: '/' }]
  );
  const segmentBranche = $derived(
    convertiBrancheEnSegment(utilisateurEstConnecté ? (brancheConnectee ?? branche) : branche) ?? []
  );
  const segmentFeuille = $derived({
    id: `noeud-${decodeEntiteHtml(feuille)}`,
    label: decodeEntiteHtml(feuille),
    href: '',
  });
  const segments: Segment[] = $derived([...segmentAccueil, ...segmentBranche, segmentFeuille]);
</script>

<dsfr-breadcrumb inverse={fondSombre} buttonLabel="Voir le fil d'Ariane" segments={enPropriétéWebC(segments)}
></dsfr-breadcrumb>

<style lang="scss">
  dsfr-breadcrumb {
    max-height: 20px;
    transform: translateY(-16px);
  }
</style>
