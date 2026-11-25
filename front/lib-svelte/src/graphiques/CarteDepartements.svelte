<script lang="ts">
  import { on } from 'svelte/events';
  import ConteneurGraphiqueDsfr from './ConteneurGraphiqueDsfr.svelte';

  interface Props {
    totaux: Array<{ code: string; total: number }>;
    nom: string;
    totalNational: number;
    palette?: 'sequentialAscending';
  }

  let { totaux, nom, totalNational, palette = 'sequentialAscending' }: Props = $props();

  const CODES_OUTRE_MER_DE_LA_CARTE = ['971', '972', '973', '974', '976'];

  const estSurLaCarte = (code: string) => code.length === 2 || CODES_OUTRE_MER_DE_LA_CARTE.includes(code);

  // Les totaux sont passés en chaînes : avec le nombre 0, la carte afficherait le total national
  // à la place de celui du département sélectionné.
  const données = $derived(
    Object.fromEntries(totaux.filter(({ code }) => estSurLaCarte(code)).map(({ code, total }) => [code, String(total)]))
  );

  const ÉCART_AVEC_LE_CURSEUR = 16;

  // DSFR Chart calcule la position de l'infobulle par rapport à la carte, mais l'applique par rapport
  // à son bloc parent : dès que la carte est centrée, l'infobulle se décale vers la gauche.
  const placeInfobulleÀCôtéDuCurseur = (conteneur: HTMLElement) =>
    on(conteneur, 'mousemove', ({ clientX, clientY }) => {
      const infobulle = conteneur.querySelector<HTMLElement>('.map_tooltip');
      const bloc = infobulle?.offsetParent?.getBoundingClientRect();
      if (!infobulle || !bloc) return;

      const x = clientX - bloc.left;
      const àDroite = x + ÉCART_AVEC_LE_CURSEUR;
      const àGauche = x - ÉCART_AVEC_LE_CURSEUR - infobulle.offsetWidth;
      const tientÀDroite = àDroite + infobulle.offsetWidth <= bloc.width;
      infobulle.style.left = `${tientÀDroite ? àDroite : àGauche}px`;
      infobulle.style.top = `${clientY - bloc.top}px`;
    });
</script>

<div {@attach placeInfobulleÀCôtéDuCurseur}>
  <ConteneurGraphiqueDsfr>
    <map-chart data={JSON.stringify(données)} name={nom} value={totalNational} level="dep" selected-palette={palette}
    ></map-chart>
  </ConteneurGraphiqueDsfr>
</div>
