import {mount} from "svelte";
import TestMaturite from "./test-maturite/TestMaturite.svelte";


const testMaturite = mount(TestMaturite, {
    target: document.getElementById("test-maturite")!,
});

export default testMaturite;
