import axios from 'axios';

import { Article } from '@article/article.type';

export type RésuméArticleAPI = { id: string; slug: string; titre: string };

type EntréeTableDesMatièresAPI = {
  id: string;
  texte: string;
  profondeur: number;
};

type ArticleAPI = {
  contenu: string;
  dateDeMiseÀJour: Date | undefined;
  dateDePublication: Date | undefined;
  description: string;
  tableDesMatières: EntréeTableDesMatièresAPI[];
  titre: string;
};

export const récupèreRésumésDArticle = async () => {
  const { data } = await axios.get<RésuméArticleAPI[]>('/api/articles');
  return data;
};

export const récupèreArticle = async (slug: string): Promise<Article | undefined> => {
  const { data } = await axios.get<ArticleAPI>(`/api/articles/${slug}`);

  return new Article(data);
};
