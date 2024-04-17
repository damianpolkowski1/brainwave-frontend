import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ScoreServiceService } from '../score-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-to-leaderboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-to-leaderboard.component.html',
  styleUrl: './add-to-leaderboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AddToLeaderboardComponent implements OnInit {
  constructor(
    private scoreService: ScoreServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  fadeIn: boolean = false;
  fadeOut: boolean = false;
  slideIn: boolean = false;
  formSubmitted: boolean = false;

  async ngOnInit() {
    this.slideIn = true;
    await this.delay(800);
    this.slideIn = false;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  leaderboardForm = new FormGroup({
    Nickname: new FormControl(''),
  });

  async submitForm() {
    if (this.formSubmitted) {
      this.router.navigate([`/`], { relativeTo: this.route });
      return;
    }
    this.fadeOut = true;
    this.formSubmitted = true;
    await this.delay(700);
    this.fadeOut = false;

    this.scoreService.postScore(
      this.scoreService.getScore().score,
      this.leaderboardForm.value.Nickname ?? ''
    );

    this.router.navigate([`/`], { relativeTo: this.route });
  }
}
