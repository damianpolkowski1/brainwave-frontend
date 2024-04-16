import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { GameplayPageComponent } from './gameplay-page/gameplay-page.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { ScorePageComponent } from './score-page/score-page.component';

const routes: Routes = [
  {
    path: '',
    component: QuizPageComponent,
    title: 'Home page',
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
    path: 'leaderboard',
    component: AppComponent,
    title: 'Leaderboard',
  },
];

export default routes;
