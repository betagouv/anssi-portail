import { writable } from "svelte/store";
import type { BesoinCyber } from "../Catalogue.types";

export const rechercheParBesoin = writable<BesoinCyber>();
