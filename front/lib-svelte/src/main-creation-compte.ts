import { mount } from "svelte";
import CreationCompte from "./creation-compte/CreationCompte.svelte";

const creationCompte = mount(CreationCompte, {
  target: document.getElementById("creation-compte")!,
});

export default creationCompte;
