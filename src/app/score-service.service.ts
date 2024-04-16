import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScoreServiceService {
  private score: number = 0;

  constructor() {}

  setScore(value: number) {
    this.score = value;
  }

  getScore(): number {
    return this.score;
  }
}
