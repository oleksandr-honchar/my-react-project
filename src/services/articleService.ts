import type { Article } from '../components/types/article';

export type ArticlesHttpResponse = {
  hits: Article[];
  nbPages: number;
};

export function fetchArticles(topic: string, page: number): Promise<ArticlesHttpResponse> {
  return fetch(`https://hn.algolia.com/api/v1/search?query=${topic}&page=${page}`)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    });
}
