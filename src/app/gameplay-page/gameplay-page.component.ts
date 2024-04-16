import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GameplayService } from '../gameplay.service';
import { Answer } from '../answer';
import { ScoreServiceService } from '../score-service.service';

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
    private gameplayService: GameplayService,
    private router: Router,
    private scoreService: ScoreServiceService,
    @Inject(DOCUMENT) private document: Document
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
      'buttonRow',
      this.document
    );

    for (let i = 0; i < 4; i++) {
      const button = this.document.getElementById('answerButton' + i);

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
            const buttonForDeleting = this.document.getElementById(
              'answerButton' + x
            );
            buttonForDeleting?.remove();
          }

          if (this.currentQuestionIndex >= 10) {
            console.log(
              'Score: ' +
                (await this.gameplayService.calculateScore(this.answers))
            );
            this.scoreService.setScore(
              await this.gameplayService.calculateScore(this.answers)
            );
            this.router.navigate(['/finished-quiz']);
            return;
          }
          this.displayQuestion();
        });
      }
    }
  }
}
