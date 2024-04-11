import { Injectable } from '@angular/core';
import { Category } from './category';

@Injectable({
  providedIn: 'root',
})
export class QuizPageService {
  private api_link = 'http://localhost:4300/';

  constructor() {}

  async getCategoryData() {
    try {
      const response = await fetch(this.api_link + 'category');
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const data: Category[] = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  }

  async renderCategories(document: Document) {
    this.getCategoryData().then((data) => {
      for (let i = 0; i < data.length; i++) {
        const newCategory = document.createElement('li');

        const categoryName = data[i].category_name;
        const pictureLink =
          this.api_link + 'images/' + data[i].category_picture_path;

        const categoryDiv = document.createElement('div');

        const image = document.createElement('img');
        image.src = pictureLink;

        const header = document.createElement('h4');
        const header_text = document.createTextNode(`${categoryName}`);
        header.appendChild(header_text);

        categoryDiv.appendChild(image);
        categoryDiv.appendChild(header);

        newCategory.appendChild(categoryDiv);

        const element = document.getElementById('category-list');

        if (element) {
          element.appendChild(newCategory);
        }
      }
    });
  }
}
