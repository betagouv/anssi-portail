import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  const kit = await locals.entrepotKitRelais.lis();
  if (!kit) return new Response('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  return Response.json(kit);
};
