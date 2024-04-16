import { TestBed } from '@angular/core/testing';

import { GameplayPageService } from './gameplay-page.service';

describe('GameplayPageService', () => {
  let service: GameplayPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameplayPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
