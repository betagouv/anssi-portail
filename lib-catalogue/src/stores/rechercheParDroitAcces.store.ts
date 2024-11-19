import { writable } from "svelte/store";
import type { DroitAcces } from "../Catalogue.types";

export const rechercheParDroitAcces = writable<DroitAcces[]>([]);
