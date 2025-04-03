import { mount } from "svelte";
import TestMaturite from "./test-maturite/TestMaturite.svelte";

mount(TestMaturite, {
  target: document.getElementById('test-maturite')!,
});
