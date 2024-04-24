import {
  Component,
  OnInit,
  ViewEncapsulation,
  NgModule,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../category';
import { DOCUMENT } from '@angular/common';
import { LeaderboardService } from '../leaderboard.service';
import { QuizPageService } from '../quiz-page.service';
import { AddQuestionService } from '../add-question.service';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AddQuestionComponent implements OnInit{
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private leaderboardService: LeaderboardService,
    private quizpageService: QuizPageService,
    private addQuestionService: AddQuestionService
  ) {}

  async ngOnInit() {
    this.leaderboardService.renderDropdownElements(await this.quizpageService.getCategoryData(), "category-input");
    this.addQuestionService.onAddQuestionFormSubmittion("add-question-form-id");
  }
}
