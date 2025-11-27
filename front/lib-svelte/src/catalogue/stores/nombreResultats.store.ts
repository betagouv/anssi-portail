import { derived } from 'svelte/store';
import { DroitAcces, Source, Typologie } from '../Catalogue.types';
import { catalogueStore } from './catalogue.store';

type NombreResultats = {
  parDroitAcces: Partial<Record<DroitAcces, number>>;
  parTypologie: Partial<Record<Typologie, number>>;
  parSource: Partial<Record<Source, number>>;
};

export const nombreResultats = derived<
  [typeof catalogueStore],
  NombreResultats
>([catalogueStore], ([$catalogueStore]) => {
  const creeObjetDepuisEnum = <T>(
    type: { [s: string]: T },
    calculNombre: (valeur: T) => number
  ) => Object.fromEntries(Object.values(type).map((f) => [f, calculNombre(f)]));

  const nombreParDroitAcces = (droitAcces: DroitAcces) =>
    $catalogueStore.items.filter(
      (item) => item.droitsAcces && item.droitsAcces.includes(droitAcces)
    ).length;

  const nombreParTypologie = (typologie: Typologie) =>
    $catalogueStore.items.filter((item) => item.typologie === typologie).length;

  const nombreParSource = (source: Source) =>
    $catalogueStore.items.filter((item) => {
      if (!item.sources) return false;
      switch (source) {
        case Source.PARTENAIRES:
          return !item.sources.includes(Source.ANSSI);
        case Source.ANSSI_TOUTES:
          return item.sources.includes(Source.ANSSI);
        case Source.ANSSI: {
          const secondaire = item.sources.find((s) => s !== Source.ANSSI);
          return !secondaire;
        }
        default:
          return item.sources.includes(source);
      }
    }).length;

  return {
    parDroitAcces: creeObjetDepuisEnum(DroitAcces, nombreParDroitAcces),
    parTypologie: creeObjetDepuisEnum(Typologie, nombreParTypologie),
    parSource: creeObjetDepuisEnum(Source, nombreParSource),
  };
});
