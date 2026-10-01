import axios from 'axios';

export type RésuméArticleAPI = { slug: string; titre: string };

export const récupèreRésumésDArticle = async () => {
  const { data } = await axios.get<RésuméArticleAPI[]>('/api/articles');
  return data;
};

export const récupèreArticle = async (slug: string): Promise<RésuméArticleAPI | undefined> => {
  const { data } = await axios.get<RésuméArticleAPI[]>('/api/articles');
  return data.find((ra) => ra.slug === slug);
};
