import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Question } from './question';
import { LeaderboardService } from './leaderboard.service';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class ManageService {
  private api_link = 'http://localhost:4300/';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private leaderboardService: LeaderboardService,
    private appService: AppService
  ) {}

  async getQuestionDataByCategory(category_id: number): Promise<Question[]> {
    try {
      const response = await fetch(
        this.api_link + 'question/category/' + category_id
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const data: Question[] = await response.json();
      return data;
    } catch (error) {
      return [];
    }
  }

  async renderQuestionList(questions: Question[]) {
    for (let i = 0; i < questions.length; i++) {
      const listElement = this.document.createElement('li');
      listElement.setAttribute('id', 'list-element-' + i);

      const question_content = this.document.createElement('span');
      question_content.setAttribute('class', 'question');
      const question_text = this.document.createTextNode(
        questions[i].question_content
      );
      question_content.appendChild(question_text);

      const category = this.document.createElement('span');
      category.setAttribute('class', 'category');
      const category_text = this.document.createTextNode(
        await this.leaderboardService.translateCategoryIdToCategoryName(
          questions[i].category_id
        )
      );
      category.appendChild(category_text);

      const modify_span = this.document.createElement('span');
      modify_span.setAttribute('class', 'modify');
      const modify_button = this.document.createElement('button');
      modify_button.setAttribute('class', 'modify-button');
      modify_button.setAttribute('id', 'modify-' + questions[i].question_id);
      const modify_button_text = this.document.createTextNode('Modify');
      modify_button.appendChild(modify_button_text);
      modify_span.appendChild(modify_button);

      const delete_span = this.document.createElement('span');
      delete_span.setAttribute('class', 'delete');
      const delete_button = this.document.createElement('button');
      delete_button.setAttribute('class', 'delete-button');
      delete_button.setAttribute('id', 'delete-' + questions[i].question_id);
      const delete_button_text = this.document.createTextNode('Delete');
      delete_button.appendChild(delete_button_text);
      delete_span.appendChild(delete_button);

      listElement.appendChild(question_content);
      listElement.appendChild(category);
      listElement.appendChild(modify_span);
      listElement.appendChild(delete_span);

      const component = this;

      if (modify_button) {
        modify_button.addEventListener('click', async function () {
          component.createModifyQuestionPopUpWindow(
            'leaderboard-container-id',
            await component.getSpecificQuestion(questions[i].question_id)
          );
          component.appService.togglePopup('modify-PopupOverlay');
          component.document.body.classList.add('modal-open');
        });
      }

      if (delete_button) {
        delete_button.addEventListener('click', async function () {
          component.createDeleteQuestionPopUpWindow(
            'leaderboard-container-id',
            questions[i].question_id
          );
          component.appService.togglePopup('delete-PopupOverlay');
        });
      }

      const element = this.document.getElementById('manage-ordered-list');

      if (element) element.appendChild(listElement);
    }
  }

  clearQuestionTable() {
    const question_list = this.document.getElementById('manage-ordered-list');
    question_list?.remove();

    const new_list = this.document.createElement('ol');
    new_list.setAttribute('id', 'manage-ordered-list');

    const header_entry = this.document.createElement('li');
    header_entry.setAttribute('class', 'manage-list-description');

    const question = this.document.createElement('span');
    question.setAttribute('class', 'question');
    question.textContent = 'Question';

    const category = this.document.createElement('span');
    category.setAttribute('class', 'category');
    category.textContent = 'Category';

    const modify = this.document.createElement('span');
    modify.setAttribute('class', 'modify');
    modify.textContent = 'Modify';

    const del = this.document.createElement('span');
    del.setAttribute('class', 'delete');
    del.textContent = 'Delete';

    header_entry.appendChild(question);
    header_entry.appendChild(category);
    header_entry.appendChild(modify);
    header_entry.appendChild(del);

    new_list.appendChild(header_entry);

    const element = this.document.getElementById('manage-list-id');
    if (element) element.appendChild(new_list);
  }

  async createModifyQuestionPopUpWindow(
    elementToAppend: string,
    question: Question
  ) {
    const popupOverlay = this.document.createElement('div');
    popupOverlay.setAttribute('class', 'overlay-container');
    popupOverlay.setAttribute('id', 'modify-PopupOverlay');

    const popupWindow = this.document.createElement('div');
    popupWindow.setAttribute('class', 'popup-window');
    popupWindow.setAttribute('id', 'modify-popup-window');

    const closeButton = this.document.createElement('button');
    closeButton.setAttribute('class', 'close-button');
    closeButton.innerHTML = '&times;';
    popupWindow.appendChild(closeButton);

    const popupTitle = this.document.createElement('h2');
    popupTitle.textContent = 'Modify question';

    const popupForm = this.document.createElement('form');
    popupForm.setAttribute('class', 'popup-form-container');
    popupForm.setAttribute('id', 'modify-popup-form');
    popupForm.setAttribute('enctype', 'multipart/form-data');

    const questionContentLabel = this.document.createElement('label');
    questionContentLabel.setAttribute('class', 'popup-form-label');
    questionContentLabel.setAttribute('for', 'content-input');
    questionContentLabel.textContent = 'Question Content';

    const questionContentInput = this.document.createElement('textarea');
    questionContentInput.setAttribute('type', 'text');
    questionContentInput.setAttribute('class', 'popup-form-input');
    questionContentInput.setAttribute('id', 'content-input');
    questionContentInput.setAttribute('name', 'question_content');
    questionContentInput.textContent = question.question_content;

    const correctAnswerLabel = this.document.createElement('label');
    correctAnswerLabel.setAttribute('class', 'popup-form-label');
    correctAnswerLabel.setAttribute('for', 'correct-input');
    correctAnswerLabel.textContent = 'Correct answer';

    const correctAnswerInput = this.document.createElement('input');
    correctAnswerInput.setAttribute('type', 'text');
    correctAnswerInput.setAttribute('class', 'popup-form-input');
    correctAnswerInput.setAttribute('id', 'correct-input');
    correctAnswerInput.setAttribute('name', 'correct_answer');
    correctAnswerInput.setAttribute('value', question.correct_answer);

    const incorrect1Label = this.document.createElement('label');
    incorrect1Label.setAttribute('class', 'popup-form-label');
    incorrect1Label.setAttribute('for', 'incorrect1-input');
    incorrect1Label.textContent = 'First incorrect answer';

    const incorrect1Input = this.document.createElement('input');
    incorrect1Input.setAttribute('type', 'text');
    incorrect1Input.setAttribute('class', 'popup-form-input');
    incorrect1Input.setAttribute('id', 'incorrect1-input');
    incorrect1Input.setAttribute('name', 'incorrect1');
    incorrect1Input.setAttribute('value', question.incorrect1);

    const incorrect2Label = this.document.createElement('label');
    incorrect2Label.setAttribute('class', 'popup-form-label');
    incorrect2Label.setAttribute('for', 'incorrect2-input');
    incorrect2Label.textContent = 'Second incorrect answer';

    const incorrect2Input = this.document.createElement('input');
    incorrect2Input.setAttribute('type', 'text');
    incorrect2Input.setAttribute('class', 'popup-form-input');
    incorrect2Input.setAttribute('id', 'incorrect2-input');
    incorrect2Input.setAttribute('name', 'incorrect2');
    incorrect2Input.setAttribute('value', question.incorrect2);

    const incorrect3Label = this.document.createElement('label');
    incorrect3Label.setAttribute('class', 'popup-form-label');
    incorrect3Label.setAttribute('for', 'incorrect3-input');
    incorrect3Label.textContent = 'Third incorrect answer';

    const incorrect3Input = this.document.createElement('input');
    incorrect3Input.setAttribute('type', 'text');
    incorrect3Input.setAttribute('class', 'popup-form-input');
    incorrect3Input.setAttribute('id', 'incorrect3-input');
    incorrect3Input.setAttribute('name', 'incorrect3');
    incorrect3Input.setAttribute('value', question.incorrect3);

    const imageLabel = this.document.createElement('label');
    imageLabel.setAttribute('class', 'popup-form-label');
    imageLabel.setAttribute('for', 'image-input');
    imageLabel.textContent = 'Select image from your local files';

    const imageInput = this.document.createElement('input');
    imageInput.setAttribute('type', 'file');
    imageInput.setAttribute('accept', '.png,.jpg,.jpeg');
    imageInput.setAttribute('class', 'popup-form-input');
    imageInput.setAttribute('id', 'image-input');
    imageInput.setAttribute('name', 'question_picture_path');
    imageInput.setAttribute('style', 'resize: none;');
    imageInput.removeAttribute('multiple');

    questionContentInput.setAttribute('required', '');
    correctAnswerInput.setAttribute('required', '');
    incorrect1Input.setAttribute('required', '');
    incorrect2Input.setAttribute('required', '');
    incorrect3Input.setAttribute('required', '');
    imageInput.setAttribute('required', '');

    const submitFormDiv = this.document.createElement('div');
    submitFormDiv.setAttribute('class', 'submit-button-container');

    const submitFormButton = this.document.createElement('button');
    submitFormButton.setAttribute('type', 'submit');
    submitFormButton.setAttribute('class', 'submit-button');
    submitFormButton.textContent = 'Submit';

    submitFormDiv.appendChild(submitFormButton);

    popupForm.appendChild(questionContentLabel);
    popupForm.appendChild(questionContentInput);
    popupForm.appendChild(correctAnswerLabel);
    popupForm.appendChild(correctAnswerInput);
    popupForm.appendChild(incorrect1Label);
    popupForm.appendChild(incorrect1Input);
    popupForm.appendChild(incorrect2Label);
    popupForm.appendChild(incorrect2Input);
    popupForm.appendChild(incorrect3Label);
    popupForm.appendChild(incorrect3Input);
    popupForm.appendChild(imageLabel);
    popupForm.appendChild(imageInput);
    popupForm.appendChild(submitFormDiv);

    popupWindow.appendChild(popupTitle);
    popupWindow.appendChild(popupForm);

    popupOverlay.appendChild(popupWindow);

    const toAppend = this.document.getElementById(elementToAppend);

    if (toAppend) toAppend.appendChild(popupOverlay);

    document.addEventListener('click', this.handleOutsidePopupClick.bind(this));
    this.onModifyFormSubmittion('modify-popup-form', question.question_id);

    const component = this;

    if (closeButton) {
      closeButton.addEventListener('click', async function () {
        component.appService.closePopup('modify-PopupOverlay');
        component.document.body.classList.remove('modal-open');
      });
    }
  }

  handleOutsidePopupClick(event: MouseEvent) {
    const popupElement = this.document.getElementById('modify-popup-window');
    const popupOverlayElement = this.document.getElementById(
      'modify-PopupOverlay'
    );

    if (popupElement && popupOverlayElement) {
      const isClickedInsidePopup = popupElement.contains(event.target as Node);
      const isClickedInsideOverlay = popupOverlayElement.contains(
        event.target as Node
      );

      if (!isClickedInsidePopup && isClickedInsideOverlay) {
        this.appService.closePopup('modify-PopupOverlay');
        this.document.body.classList.remove('modal-open');
      }
    }
  }

  onModifyFormSubmittion(FormId: string, entityId: string) {
    const form = document.getElementById(FormId) as HTMLFormElement;

    const component = this;

    form.addEventListener('submit', function (submittion) {
      submittion.preventDefault();

      fetch(component.api_link + 'question/modify/' + entityId, {
        method: 'POST',
        body: new FormData(this),
      }).then((response) => {
        if (response.ok) {
          component.appService.closePopup('modify-PopupOverlay');
          component.document.body.classList.remove('modal-open');
        }
      });
    });
  }

  async createDeleteQuestionPopUpWindow(
    elementToAppend: string,
    question_id: string
  ) {
    const popupOverlay = this.document.createElement('div');
    popupOverlay.setAttribute('class', 'overlay-container');
    popupOverlay.setAttribute('id', 'delete-PopupOverlay');

    const popupWindow = this.document.createElement('div');
    popupWindow.setAttribute('class', 'popup-window');
    popupWindow.setAttribute('id', 'delete-popup-window');

    const popupTitle = this.document.createElement('h2');
    popupTitle.textContent = `Are you sure you want to delete this question?`;

    const popupNotification = this.document.createElement('h3');
    popupNotification.textContent = 'This process is irreversible';

    const yesButton = this.document.createElement('button');
    yesButton.setAttribute('type', 'delete');
    yesButton.setAttribute('class', 'do-delete-button');
    yesButton.setAttribute('id', 'confirm-delete-button');
    yesButton.textContent = 'Yes';

    const noButton = this.document.createElement('button');
    noButton.setAttribute('type', 'delete');
    noButton.setAttribute('class', 'do-not-delete-button');
    noButton.setAttribute('id', 'deny-delete-button');
    noButton.textContent = 'No';

    popupWindow.appendChild(popupTitle);
    popupWindow.appendChild(popupNotification);
    popupWindow.appendChild(yesButton);
    popupWindow.appendChild(noButton);

    popupOverlay.appendChild(popupWindow);

    const toAppend = this.document.getElementById(elementToAppend);

    if (toAppend) toAppend.appendChild(popupOverlay);
    document.addEventListener(
      'click',
      this.handleOutsideDeletePopupClick.bind(this)
    );

    const component = this;

    if (yesButton) {
      yesButton.addEventListener('click', async function () {
        await component.deleteQuestion(question_id).then(() => {
          component.appService.closePopup('delete-PopupOverlay');
        });
      });
    }

    if (noButton) {
      noButton.addEventListener('click', async function () {
        component.appService.closePopup('delete-PopupOverlay');
      });
    }
  }

  handleOutsideDeletePopupClick(event: MouseEvent) {
    const popupElement = this.document.getElementById('delete-popup-window');
    const popupOverlayElement = this.document.getElementById(
      'delete-PopupOverlay'
    );

    if (popupElement && popupOverlayElement) {
      const isClickedInsidePopup = popupElement.contains(event.target as Node);
      const isClickedInsideOverlay = popupOverlayElement.contains(
        event.target as Node
      );

      if (!isClickedInsidePopup && isClickedInsideOverlay) {
        this.appService.closePopup('delete-PopupOverlay');
      }
    }
  }

  async getSpecificQuestion(question_id: string): Promise<Question> {
    try {
      const response = await fetch(this.api_link + 'question/' + question_id);
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const data: Question = await response.json();
      return data;
    } catch (error) {
      return {
        question_id: '',
        category_id: 0,
        question_content: '',
        correct_answer: '',
        incorrect1: '',
        incorrect2: '',
        incorrect3: '',
        question_picture_path: '',
      };
    }
  }

  async deleteQuestion(question_id: string) {
    try {
      const response = await fetch(
        this.api_link + 'question/delete/' + question_id,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return '';
    }
  }
}
