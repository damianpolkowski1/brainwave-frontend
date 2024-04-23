import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AddQuestionService {
  private api_link = 'http://localhost:4300/';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  onAddQuestionFormSubmittion(FormId: string) {
    const form = document.getElementById(FormId) as HTMLFormElement;

    const component = this;

    form.addEventListener('submit', function (submittion) {
      submittion.preventDefault();

      fetch(component.api_link + 'question/add/', {
        method: 'POST',
        body: new FormData(this),
      }).then((response) => {
        if (response.ok) {
          console.log('gitara');
        }
      });
    });
  }
}
