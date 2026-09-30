import axios from 'axios';

export type RésuméArticleAPI = { slug: string; titre: string };

export const récupèreRésumésDArticle = async () => {
  const { data } = await axios.get<RésuméArticleAPI[]>('/api/articles');
  return data;
};
