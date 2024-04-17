import {
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
} from '@angular/core';
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
  fadeOut: boolean = false;
  fadeIn: boolean = false;
  fadeOutFast: boolean = false;

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

    this.fadeOutFast = true;
    await this.delay(12);
    this.fadeOutFast = false;

    this.displayQuestion();
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async displayQuestion() {
    let startTime = new Date();

    this.currentQuestion = this.questionSet[this.currentQuestionIndex];
    const correctAnswerButtonId = this.gameplayService.renderAnswerButtons(
      this.currentQuestion,
      'buttonRow',
      this.document
    );

    this.fadeIn = true;
    await this.delay(700);
    this.fadeIn = false;

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

          this.fadeOut = true;
          await this.delay(700);
          this.fadeOut = false;

          for (let x = 0; x < 4; x++) {
            const buttonForDeleting = this.document.getElementById(
              'answerButton' + x
            );
            buttonForDeleting?.remove();
          }

          if (this.currentQuestionIndex >= 10) {
            this.scoreService.setScore(
              await this.gameplayService.calculateScore(this.answers)
            );
            console.log(this.scoreService.getScore().score);
            this.router.navigate(['/finished-quiz']);
            return;
          }

          this.displayQuestion();
        });
      }
    }
  }
}
