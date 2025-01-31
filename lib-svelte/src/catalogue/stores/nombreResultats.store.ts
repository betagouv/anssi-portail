import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import {
  DroitAcces,
  FormatRessource,
  Source,
  ThemeCyber,
  Typologie,
} from "../Catalogue.types";

type NombreResultats = {
  parDroitAcces: Partial<Record<DroitAcces, number>>;
  parTypologie: Partial<Record<Typologie, number>>;
  parFormatDeRessource: Partial<Record<FormatRessource, number>>;
  parSource: Partial<Record<Source, number>>;
  parTheme: Partial<Record<ThemeCyber, number>>;
};

export const nombreResultats = derived<
  [typeof catalogueStore],
  NombreResultats
>([catalogueStore], ([$catalogueStore]) => {
  const creeObjetDepuisEnum = <T>(
    type: { [s: string]: T },
    calculNombre: (valeur: T) => number,
  ) => Object.fromEntries(Object.values(type).map((f) => [f, calculNombre(f)]));

  const nombreParDroitAcces = (droitAcces: DroitAcces) =>
    $catalogueStore.filter(
      (item) => item.droitsAcces && item.droitsAcces.includes(droitAcces),
    ).length;

  const nombreParTypologie = (typologie: Typologie) =>
    $catalogueStore.filter((item) => item.typologie === typologie).length;

  const nombreParFormatDeRessource = (format: FormatRessource) =>
    $catalogueStore.filter((item) => item.format === format).length;

  const nombreParSource = (source: Source) =>
    $catalogueStore.filter((item) => {
      if (!item.sources) return false;
      if (!item.sources.includes(Source.ANSSI) && source === Source.PARTENAIRES)
        return true;
      return item.sources.includes(source);
    }).length;

  const nombreParTheme = (theme: ThemeCyber) =>
    $catalogueStore.filter((item) => item.themes && item.themes.includes(theme))
      .length;

  return {
    parDroitAcces: creeObjetDepuisEnum(DroitAcces, nombreParDroitAcces),
    parTypologie: creeObjetDepuisEnum(Typologie, nombreParTypologie),
    parFormatDeRessource: creeObjetDepuisEnum(
      FormatRessource,
      nombreParFormatDeRessource,
    ),
    parSource: creeObjetDepuisEnum(Source, nombreParSource),
    parTheme: creeObjetDepuisEnum(ThemeCyber, nombreParTheme),
  };
});
