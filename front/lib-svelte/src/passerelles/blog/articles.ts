import axios from 'axios';

export type RésuméArticleAPI = { id: string; slug: string; titre: string };

export type ArticleAPI = {
  contenu: string;
  dateDeMiseÀJour: string | undefined;
  dateDePublication: string | undefined;
  description: string;
  titre: string;
};

export const récupèreRésumésDArticle = async () => {
  const { data } = await axios.get<RésuméArticleAPI[]>('/api/articles');
  return data;
};

export const récupèreArticle = async (slug: string): Promise<ArticleAPI | undefined> => {
  const { data } = await axios.get<ArticleAPI>(`/api/articles/${slug}`);
  return data;
};
