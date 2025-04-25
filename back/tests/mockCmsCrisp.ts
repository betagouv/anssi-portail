import { CmsCrisp, PageHtmlCrisp } from '@lab-anssi/lib';

export class MockCmsCrisp extends CmsCrisp {
  private articles: Record<string, PageHtmlCrisp> = {};

  recupereArticle = async (id: string): Promise<PageHtmlCrisp> =>
    this.articles[id];

  ajouteArticle(id: string, article: PageHtmlCrisp) {
    this.articles[id] = article;
  }
}
