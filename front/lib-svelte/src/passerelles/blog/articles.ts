import axios from 'axios';

export type RésuméArticleAPI = { id: string; slug: string; titre: string };

export const récupèreRésumésDArticle = async () => {
  const { data } = await axios.get<RésuméArticleAPI[]>('/api/articles');
  return data;
};

export const récupèreArticle = async (slug: string): Promise<RésuméArticleAPI | undefined> => {
  const { data } = await axios.get<RésuméArticleAPI>(`/api/articles/${slug}`);
  return data;
};
