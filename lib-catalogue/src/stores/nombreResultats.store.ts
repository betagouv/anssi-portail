import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { DroitAcces } from "../Catalogue.types";

type NombreResultats = {
  parDroitAcces: Partial<Record<DroitAcces, number>>;
};

export const nombreResultats = derived<
  [typeof catalogueStore],
  NombreResultats
>([catalogueStore], ([$catalogueStore]) => {
  const nombreParDroitAcces = (droitAcces: DroitAcces) =>
    $catalogueStore.filter((item) => item.droitsAcces.includes(droitAcces))
      .length;

  const parDroitAcces = Object.values(DroitAcces).reduce(
    (acc, droit) => ({ ...acc, [droit]: nombreParDroitAcces(droit) }),
    {},
  );

  return { parDroitAcces };
});
