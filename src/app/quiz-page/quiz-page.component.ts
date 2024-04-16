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

  ngOnInit() {
    this.quizPageService.renderCategories(this.document);
  }
}
