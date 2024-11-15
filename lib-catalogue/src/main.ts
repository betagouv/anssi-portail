import {mount} from 'svelte'
import Catalogue from './Catalogue.svelte'

const d = document.getElementById("donnees")!.textContent
if (!d)
    throw new Error();

const donnees = JSON.parse(d);

const catalogue = mount(Catalogue, {
    target: document.getElementById('catalogue')!,
    props: {...donnees}
})

export default catalogue
