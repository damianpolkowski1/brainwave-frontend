import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import JSConfetti from 'js-confetti';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AddQuestionService {
  private api_link = 'http://localhost:4300/';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onAddQuestionFormSubmittion(FormId: string) {
    const form = this.document.getElementById(FormId) as HTMLFormElement;

    const component = this;

    form.addEventListener('submit', function (submittion) {
      submittion.preventDefault();

      fetch(component.api_link + 'question/add/', {
        method: 'POST',
        body: new FormData(this),
      }).then(async (response) => {
        if (response.ok) {
          const buttonToDelete = component.document.getElementById(
            'submit-button-container-id'
          );
          buttonToDelete?.remove();

          component.afterQuestionSubmittion();
        }
      });
    });
  }

  async afterQuestionSubmittion() {
    const elementToDelete = this.document.getElementById(
      'add-question-container-id'
    );
    elementToDelete?.remove();

    const jsConfetti = new JSConfetti();
    const submittionDiv = this.document.createElement('div');
    submittionDiv.setAttribute('class', 'submittion-div');

    const submittionHeader = this.document.createElement('h2');
    submittionHeader.setAttribute('class', 'submittion-header');
    const headerText = this.document.createTextNode(
      'Your question has been saved!'
    );
    submittionHeader.appendChild(headerText);

    submittionDiv.appendChild(submittionHeader);

    const elementToAppend = this.document.getElementById('container-id');

    if (elementToAppend) elementToAppend.appendChild(submittionDiv);

    await jsConfetti.addConfetti({
      confettiRadius: 6,
      confettiNumber: 600,
    });

    await this.delay(1000);
    this.router.navigate([`/`], { relativeTo: this.route });
  }
}
