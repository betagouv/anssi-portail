<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';
  import { decodeEntiteHtml } from '../utils/aseptisationDuHtml.js';
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
  const segments: Segment[] = $derived([
    ...($profilStore
      ? [{ id: 'noeud-catalogue', label: 'Guides et ressources', href: '/catalogue' }]
      : [{ id: 'noeud-accueil', label: 'Accueil', href: '/' }]),
    ...(branche ? [{ id: `noeud-${branche.nom}`, label: branche.nom, href: branche.lien ?? '' }] : []),
    ...(brancheConnectee
      ? [{ id: `noeud-${brancheConnectee.nom}`, label: brancheConnectee.nom, href: brancheConnectee.lien ?? '' }]
      : []),
    { id: `noeud-${decodeEntiteHtml(feuille)}`, label: decodeEntiteHtml(feuille), href: '' },
  ]);
</script>

<dsfr-breadcrumb inverse={fondSombre} buttonLabel="Voir le fil d'Ariane" {segments}></dsfr-breadcrumb>

<style lang="scss">
  dsfr-breadcrumb {
    max-height: 20px;
    transform: translateY(-16px);
  }
</style>
