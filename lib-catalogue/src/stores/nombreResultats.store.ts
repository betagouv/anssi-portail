import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { DroitAcces, FormatRessource, Typologie } from "../Catalogue.types";

type NombreResultats = {
  parDroitAcces: Partial<Record<DroitAcces, number>>;
  parTypologie: Partial<Record<Typologie, number>>;
  parFormatDeRessource: Partial<Record<FormatRessource, number>>;
};

export const nombreResultats = derived<
  [typeof catalogueStore],
  NombreResultats
>([catalogueStore], ([$catalogueStore]) => {
  const nombreParDroitAcces = (droitAcces: DroitAcces) =>
    $catalogueStore.filter((item) => item.droitsAcces.includes(droitAcces))
      .length;

  const parDroitAcces = Object.fromEntries(
    Object.values(DroitAcces).map((d) => [d, nombreParDroitAcces(d)]),
  );

  const nombreParTypologie = (typologie: Typologie) =>
    $catalogueStore.filter((item) => item.typologie === typologie).length;

  const parTypologie = Object.fromEntries(
    Object.values(Typologie).map((t) => [t, nombreParTypologie(t)]),
  );

  const nombreParFormatDeRessource = (format: FormatRessource) =>
    $catalogueStore.filter((item) => item.format === format).length;

  const parFormatDeRessource = Object.fromEntries(
    Object.values(FormatRessource).map((f) => [
      f,
      nombreParFormatDeRessource(f),
    ]),
  );

  return { parDroitAcces, parTypologie, parFormatDeRessource };
});
