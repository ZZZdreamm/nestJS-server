import { Controller, Injectable } from '@nestjs/common';
const NewsAPI = require('newsapi');

@Injectable()
export class NewsService {
  constructor() {}

  async getAll(searchQuery: string) {
    const news: any = await this.getNews(searchQuery);
    news.articles.forEach((article: any) => {
      article.content = article.content.split('[')[0];
      article.content = this.removeHTMLTagsFromString(article.content);
    });
    return news.articles;
  }

  private getNews(searchQuery: string) {
    const apiKey = '1f1790b27875460b9a3b23db3432160f';
    const newsapi = new NewsAPI(apiKey);
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 30);
    const limitDateInString = currentDate.toISOString().split('T')[0];
    return new Promise((resolve) => {
      newsapi.v2
        .everything({
          q: searchQuery,
          from: limitDateInString,
          sortBy: 'relevancy',
          language: 'en',
        })
        .then((response: any) => {
          resolve(response);
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  private removeHTMLTagsFromString(string: string) {
    return string.replace(/<[^>]*>?/gm, '');
  }
}
