<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';
  import { decodeEntiteHtml } from '../utils/aseptisationDuHtml.js';
  import type { Branche } from './filAriane';

  type Props = {
    feuille: string;
    branche?: Branche | string;
    brancheConnectee?: Branche | string;
    fondSombre?: boolean;
  };
  const { feuille, branche = undefined, brancheConnectee = undefined, fondSombre = false }: Props = $props();
  const construisSegment = (branche: Branche | undefined) => {
    return branche ? [{ id: `noeud-${branche.nom}`, label: branche.nom, href: branche.lien ?? '' }] : [];
  };
  const brancheCalculée = (() => {
    if (typeof branche === 'string') {
      return construisSegment(JSON.parse(branche) as Branche);
    }
    return construisSegment(branche);
  })();
  const brancheConnectéeCalculée = (() => {
    if (typeof brancheConnectee === 'string') {
      return construisSegment(JSON.parse(brancheConnectee) as Branche);
    }
    return construisSegment(brancheConnectee);
  })();

  type Segment = {
    id: string;
    label: string;
    href: string;
  };
  const segments: Segment[] = $derived.by(() => {
    if (typeof window === 'undefined') {
      return [
        { id: 'noeud-accueil', label: 'Accueil', href: '/' },
        ...brancheCalculée,
        { id: `noeud-${feuille}`, label: feuille, href: '' },
      ];
    }

    return [
      ...($profilStore
        ? [{ id: 'noeud-catalogue', label: 'Guides et ressources', href: '/catalogue' }]
        : [{ id: 'noeud-accueil', label: 'Accueil', href: '/' }]),
      ...brancheCalculée,
      ...brancheConnectéeCalculée,
      { id: `noeud-${decodeEntiteHtml(feuille)}`, label: decodeEntiteHtml(feuille), href: '' },
    ];
  });
</script>

<dsfr-breadcrumb inverse={fondSombre} buttonLabel="Voir le fil d'Ariane" segments={JSON.stringify(segments)}
></dsfr-breadcrumb>

<style lang="scss">
  dsfr-breadcrumb {
    max-height: 20px;
    transform: translateY(-16px);
  }
</style>
