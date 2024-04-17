import { Injectable } from '@angular/core';
import { Score } from './score';

@Injectable({
  providedIn: 'root',
})
export class ScoreServiceService {
  private score: Score = { score: 0, correct_answers: 0, incorrect_answers: 0, avg_answer_time: 0};
  private api_link = 'http://localhost:4300/';

  constructor() {}

  setScore(value: Score) {
    this.score = value;
  }

  getScore(): Score {
    return this.score;
  }

  async postScore(score: number, username: string) {
    const requestBody = {
      username: username,
      score: score,
    };

    try {
      const data = await fetch(this.api_link + 'score/post', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          ['Content-Type']: 'application/json',
        },
      }).then(
        async (response) => {
          const data = await response.json();
          return data;
        },
        (err) => console.error(err)
      );
      return data;
    } catch (error) {
      console.error('Error happened: ', error);
    }
  }
}
