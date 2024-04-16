import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreServiceService } from '../score-service.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-score-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-page.component.html',
  styleUrl: './score-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ScorePageComponent implements OnInit, OnDestroy {
  score_first_digit: string = '';
  score_remaining_digits: string = '';
  score: number = 0;
  maxScore: number = 10000;
  duration: number = 3000;
  interval: any;
  progressPercent: number = 0;
  circumference: number = 942;

  constructor(
    private route: ActivatedRoute,
    private scoreService: ScoreServiceService
  ) {}

  ngOnInit(): void {
    this.score = this.scoreService.getScore();
    this.animateScore();
  }

  animateScore() {
    let currentScore = 0;
    const steps = 1000;
    const time_step = this.duration / steps;
    let time_elapsed = 0;

    this.interval = setInterval(() => {
      time_elapsed += time_step;

      currentScore = Math.min(
        Math.round((time_elapsed / this.duration) * this.score),
        this.score
      );

      if (currentScore >= 1000) {
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

      document.documentElement.style.setProperty(
        '--progress',
        dashoffset.toString()
      );

      if (time_elapsed >= this.duration) {
        clearInterval(this.interval);
      }
    }, time_step);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
