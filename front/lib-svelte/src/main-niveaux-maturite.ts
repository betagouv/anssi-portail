import { mount } from "svelte";
import NiveauxMaturite from "./niveaux-maturite/NiveauxMaturite.svelte";

mount(NiveauxMaturite, {
  target: document.getElementById('niveaux-maturite')!,
});
