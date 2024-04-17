import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ScoreServiceService } from '../score-service.service';
import {
  ActivatedRoute,
  RouterModule,
  RouterOutlet,
  Router,
} from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { Score } from '../score';

@Component({
  selector: 'app-score-page',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './score-page.component.html',
  styleUrl: './score-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ScorePageComponent implements OnInit, OnDestroy {
  score_first_digit: string = '';
  score_remaining_digits: string = '';
  score_object: Score;
  score: number = 0;
  maxScore: number = 10000;
  duration: number = 3000;
  interval: any;
  progressPercent: number = 0;
  circumference: number = 942;
  fadeInAnimated: boolean = false;
  fadeInSummary: boolean = false;
  fadeOutFast: boolean = false;
  slideOut: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private scoreService: ScoreServiceService,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    this.score_object = {
      score: 0,
      correct_answers: 0,
      incorrect_answers: 0,
      avg_answer_time: 0,
    };
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async ngOnInit() {
    this.score_object = this.scoreService.getScore();
    this.score_object.avg_answer_time = parseFloat(
      (this.score_object.avg_answer_time / 1000).toFixed(2)
    );
    this.score = this.score_object.score;

    this.fadeOutFast = true;
    await this.delay(30);
    this.fadeOutFast = false;

    this.animateScore();

    this.fadeInAnimated = true;
    this.fadeInSummary = true;
    await this.delay(700);
    this.fadeInAnimated = false;
    this.fadeInSummary = false;
  }

  async animateScore() {
    let currentScore = 0;
    const steps = 1000;
    const time_step = this.duration / steps;
    let time_elapsed = 0;

    this.interval = setInterval(async () => {
      time_elapsed += time_step;

      currentScore = Math.min(
        Math.round((time_elapsed / this.duration) * this.score),
        this.score
      );

      if (currentScore >= 10000) {
        this.score_first_digit = String(Math.floor(currentScore)).slice(0, 2);
        this.score_remaining_digits = String(Math.floor(currentScore)).slice(2);
      } else if (currentScore >= 1000) {
        this.score_first_digit = String(Math.floor(currentScore)).charAt(0);
        this.score_remaining_digits = String(
          Math.floor(currentScore)
        ).substring(1);
      } else {
        this.score_first_digit = '';
        this.score_remaining_digits = String(Math.floor(currentScore));
      }

      const progress = (currentScore / this.maxScore) * this.circumference;
      const dashoffset = this.circumference - progress;

      this.document.documentElement.style.setProperty(
        '--progress',
        dashoffset.toString()
      );

      if (time_elapsed >= this.duration) {
        clearInterval(this.interval);
      }
    }, time_step);
  }

  async navigateAndSlide() {
    this.slideOut = true;
    await this.delay(800);
    this.slideOut = false;

    this.router.navigate(['/add-to-leaderboard']);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
