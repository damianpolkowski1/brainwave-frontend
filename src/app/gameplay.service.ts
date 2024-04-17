import { Injectable } from '@angular/core';
import { Question } from './question';

@Injectable({
  providedIn: 'root',
})
export class GameplayService {
  private api_link = 'http://localhost:4300/';

  constructor() {}

  async getSetOfQuestions(category_id: number) {
    try {
      const response = await fetch(
        this.api_link + 'question/set/' + category_id
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }
      const data: Question[] = await response.json();
      return this.addRelativePaths(data);
    } catch (error) {
      return [];
    }
  }

  addRelativePaths(data: Question[]) {
    data.forEach((question) => {
      question.question_picture_path =
        this.api_link + 'images/' + question.question_picture_path;
    });
    return data;
  }

  shuffleOrder() {
    let array = [0, 1, 2, 3];

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  renderAnswerButtons(
    question: Question,
    elementId: string,
    document: Document
  ): number {
    const answersOrder = this.shuffleOrder();
    let correctAnswer = 0;

    const answersContent = [
      question.correct_answer,
      question.incorrect1,
      question.incorrect2,
      question.incorrect3,
    ];

    for (let x = 0; x < answersOrder.length; x++) {
      if (answersOrder[x] === 0) {
        correctAnswer = x;
      }

      const answerButton = document.createElement('button');
      answerButton.setAttribute('class', 'answer-button');
      answerButton.setAttribute('id', 'answerButton' + String(x));
      const buttonText = document.createTextNode(
        answersContent[answersOrder[x]]
      );
      answerButton.appendChild(buttonText);

      let element;

      if (x <= 1) element = document.getElementById(elementId + '1');
      else element = document.getElementById(elementId + '2');

      if (element) {
        element.appendChild(answerButton);
      }
      this.styleAnswerButtons('answer-button', document);
    }

    return correctAnswer;
  }

  styleAnswerButtons(button_class: string, document: Document) {
    const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
      '.' + button_class
    );

    let longestTextLength: number = 0;

    buttons.forEach((button: HTMLButtonElement) => {
      const textLength: number = button.textContent
        ? button.textContent.length
        : 0;
      if (textLength > longestTextLength) {
        longestTextLength = textLength;
      }
    });

    buttons.forEach((button: HTMLButtonElement) => {
      button.style.width = `${longestTextLength + 40}vh`;
    });
  }

  async calculateScore(body: Object) {
    const requestBody = {
      answer_array: body,
    };

    try {
      const data = await fetch(this.api_link + 'score/calculate', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          ['Content-Type']: 'application/json',
        },
      }).then(
        async (response) => {
          const data = await response.json();
          return data;
        },
        (err) => console.error(err)
      );
      return data;
    } catch (error) {
      console.error('Error happened: ', error);
    }
  }
}
