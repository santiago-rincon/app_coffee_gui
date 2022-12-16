import { TestBed } from '@angular/core/testing';

import { FireBaseCodeErrorService } from './fire-base-code-error.service';

describe('FireBaseCodeErrorService', () => {
  let service: FireBaseCodeErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireBaseCodeErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
