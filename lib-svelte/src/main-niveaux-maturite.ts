import { mount } from "svelte";
import NiveauxMaturite from "./niveaux-maturite/NiveauxMaturite.svelte";

const niveauxMaturite = mount(NiveauxMaturite, {
  target: document.getElementById("niveaux-maturite")!,
});

export default niveauxMaturite;
