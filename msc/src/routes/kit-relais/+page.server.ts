import { error } from '@sveltejs/kit';
import type { KitRelais } from '$lib/kit-relais/kitRelais';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const réponse = await fetch('/api/pages-crisp/kit-relais');
  if (!réponse.ok) error(réponse.status);
  const kit: KitRelais = await réponse.json();
  return { kit, seo: { titre: kit.titre + ' | MesServicesCyber', nom: kit.titre, description: kit.description } };
};
