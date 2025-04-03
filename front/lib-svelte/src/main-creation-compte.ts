import { mount } from "svelte";
import CreationCompte from "./creation-compte/CreationCompte.svelte";

mount(CreationCompte, {
  target: document.getElementById('creation-compte')!,
});
