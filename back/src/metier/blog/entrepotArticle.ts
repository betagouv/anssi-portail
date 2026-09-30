export interface EntrepôtArticle {
  tous: () => Promise<{ slug: string }[]>;
}
