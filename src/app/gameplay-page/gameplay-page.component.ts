import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameplayService } from '../gameplay.service';
import { Answer } from '../answer';

@Component({
  selector: 'app-gameplay-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gameplay-page.component.html',
  styleUrl: './gameplay-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class GameplayPageComponent implements OnInit {
  questionSet: any;
  currentQuestionIndex: number = 0;
  currentQuestion: any;
  answers: Answer[] = [];

  constructor(
    private route: ActivatedRoute,
    private gameplayService: GameplayService
  ) {}

  async ngOnInit() {
    const category_id = parseInt(this.route.snapshot.params['category_id'], 10);
    this.questionSet = await this.gameplayService.getSetOfQuestions(
      category_id
    );
    this.displayQuestion();
  }

  displayQuestion() {
    let startTime = new Date();

    this.currentQuestion = this.questionSet[this.currentQuestionIndex];
    const correctAnswerButtonId = this.gameplayService.renderAnswerButtons(
      this.currentQuestion,
      'buttonRow'
    );

    for (let i = 0; i < 4; i++) {
      const button = document.getElementById('answerButton' + i);

      if (button) {
        button.addEventListener('click', async () => {
          if (i === correctAnswerButtonId) {
            let endTime = new Date();
            const time = endTime.getTime() - startTime.getTime();
            this.answers.push({ correct: true, time: time });
          } else {
            let endTime = new Date();
            const time = endTime.getTime() - startTime.getTime();
            this.answers.push({ correct: false, time: time });
          }

          this.currentQuestionIndex++;

          for (let x = 0; x < 4; x++) {
            const buttonForDeleting = document.getElementById(
              'answerButton' + x
            );
            buttonForDeleting?.remove();
          }

          if (this.currentQuestionIndex >= 10) {
            console.log(
              await this.gameplayService.calculateScore(this.answers)
            );
            return;
          }
          this.displayQuestion();
        });
      }
    }
  }
}
