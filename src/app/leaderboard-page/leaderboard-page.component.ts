import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { QuizPageService } from '../quiz-page.service';
import { AppService } from '../app.service';
import { LeaderboardService } from '../leaderboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaderboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leaderboard-page.component.html',
  styleUrl: './leaderboard-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LeaderboardPageComponent implements OnInit {
  selectedCategory: number = 0;
  fadeInDropdown: boolean = false;
  fadeInList: boolean = false;
  fadeOutFast: boolean = false;
  fadeOut: boolean = false;

  constructor(
    private quizpageService: QuizPageService,
    private leaderboardService: LeaderboardService,
    private appService: AppService
  ) {}

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async ngOnInit() {
    this.fadeOutFast = true;
    await this.delay(12);
    this.fadeOutFast = false;

    this.leaderboardService.renderDropdownElements(
      await this.quizpageService.getCategoryData()
    );
    this.leaderboardService.renderLeaderboardList(
      await this.leaderboardService.getLeaderboardData(this.selectedCategory)
    );

    this.fadeInDropdown = true;
    this.fadeInList = true;
    await this.delay(700);
    this.fadeInDropdown = false;
    this.fadeInList = false;
  }

  async onCategoryChange() {
    this.fadeOut = true;
    await this.delay(700);
    this.fadeOut = false;

    this.leaderboardService.removeLeaderboardElements();

    this.fadeInList = true;
    await this.delay(700);
    this.fadeInList = false;

    this.leaderboardService.renderLeaderboardList(
      await this.leaderboardService.getLeaderboardData(this.selectedCategory)
    );
  }

  onResetClick() {
    this.leaderboardService.createDeletingPopUpWindow("leaderboard-container-id");
    this.appService.togglePopup("reset-PopupOverlay");
  }
}
