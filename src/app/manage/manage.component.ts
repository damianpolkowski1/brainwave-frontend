import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizPageService } from '../quiz-page.service';
import { AppService } from '../app.service';
import { LeaderboardService } from '../leaderboard.service';
import { FormsModule } from '@angular/forms';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ManageComponent implements OnInit {
  selectedCategory: number = 0;
  numberOfQuestionsInThisCategory: number = 0;
  fadeInDropdown: boolean = false;
  fadeInList: boolean = false;
  fadeOutFast: boolean = false;
  fadeOut: boolean = false;

  constructor(
    private quizpageService: QuizPageService,
    private appService: AppService,
    private leaderboardService: LeaderboardService,
    private manageService: ManageService
  ) {}

  async ngOnInit() {
    this.fadeOutFast = true;
    await this.delay(12);
    this.fadeOutFast = false;

    this.leaderboardService.renderDropdownElements(
      await this.quizpageService.getCategoryData(),
      'dropdown-id'
    );

    const questionData = await this.manageService.getQuestionDataByCategory(
      this.selectedCategory
    );
    this.numberOfQuestionsInThisCategory = questionData.length;

    this.manageService.renderQuestionList(questionData);

    this.fadeInDropdown = true;
    this.fadeInList = true;
    await this.delay(700);
    this.fadeInDropdown = false;
    this.fadeInList = false;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async onCategoryChange() {
    this.fadeOut = true;
    await this.delay(700);
    this.fadeOut = false;

    this.manageService.clearQuestionTable();

    this.fadeInList = true;
    await this.delay(700);
    this.fadeInList = false;

    const questionData = await this.manageService.getQuestionDataByCategory(
      this.selectedCategory
    );
    this.numberOfQuestionsInThisCategory = questionData.length;

    this.manageService.renderQuestionList(questionData);
  }
}
