import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GameplayPageComponent } from './gameplay-page/gameplay-page.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { ScorePageComponent } from './score-page/score-page.component';
import { AddToLeaderboardComponent } from './add-to-leaderboard/add-to-leaderboard.component';
import { LeaderboardPageComponent } from './leaderboard-page/leaderboard-page.component';

const routes: Routes = [
  {
    path: '',
    component: QuizPageComponent,
    title: 'Choose category',
  },
  {
    path: 'ongoing-quiz/:category_id',
    component: GameplayPageComponent,
    title: 'Quiz',
  },
  {
    path: 'finished-quiz',
    component: ScorePageComponent,
    title: 'Score',
  },
  {
    path: 'add-to-leaderboard',
    component: AddToLeaderboardComponent,
    title: 'Add to Leaderboard',
  },
  {
    path: 'leaderboard',
    component: LeaderboardPageComponent,
    title: 'Leaderboard',
  },
];

export default routes;
