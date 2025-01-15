import { mount } from "svelte";
import ExtraitItems from "./ExtraitItems.svelte";

const extrait = mount(ExtraitItems, {
  target: document.getElementById("extrait")!,
});

export default extrait;
