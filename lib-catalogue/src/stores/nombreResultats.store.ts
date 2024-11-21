import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { DroitAcces, Typologie } from "../Catalogue.types";

type NombreResultats = {
  parDroitAcces: Partial<Record<DroitAcces, number>>;
  parTypologie: Partial<Record<Typologie, number>>;
};

export const nombreResultats = derived<
  [typeof catalogueStore],
  NombreResultats
>([catalogueStore], ([$catalogueStore]) => {
  const nombreParDroitAcces = (droitAcces: DroitAcces) =>
    $catalogueStore.filter((item) => item.droitsAcces.includes(droitAcces))
      .length;

  const nombreParTypologie = (typologie: Typologie) =>
    $catalogueStore.filter((item) => item.typologie === typologie).length;

  const parDroitAcces = Object.values(DroitAcces).reduce(
    (acc, droit) => ({ ...acc, [droit]: nombreParDroitAcces(droit) }),
    {},
  );

  const parTypologie = Object.values(Typologie).reduce(
    (acc, typologie) => ({
      ...acc,
      [typologie]: nombreParTypologie(typologie),
    }),
    {},
  );
  return { parDroitAcces, parTypologie };
});
