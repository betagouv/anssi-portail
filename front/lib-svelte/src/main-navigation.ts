import { mount } from 'svelte';
import Navigation from './navigation/Navigation.svelte';

const navigation = mount(Navigation, {
  target: document.getElementById('navigation')!,
});

export default navigation;
