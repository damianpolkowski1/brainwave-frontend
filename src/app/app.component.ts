import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { AppService } from './app.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuizPageComponent, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'Navbar';

  constructor(private appService: AppService) {}
}
