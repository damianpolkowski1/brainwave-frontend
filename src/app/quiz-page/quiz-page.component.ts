import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { QuizPageService } from '../quiz-page.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class QuizPageComponent implements OnInit {
  constructor(
    private quizPageService: QuizPageService,
    @Inject(DOCUMENT) private document: any
  ) {}

  fadeIn: boolean = false;
  fadeOutFast: boolean = false;

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async ngOnInit() {
    this.fadeOutFast = true;
    await this.delay(12);
    this.fadeOutFast = false;

    this.quizPageService.renderCategories(this.document);
    this.fadeIn = true;
    await this.delay(700);
    this.fadeIn = false;
  }
}
