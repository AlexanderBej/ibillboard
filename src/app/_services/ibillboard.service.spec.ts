import { TestBed } from '@angular/core/testing';

import { IbillboardService } from './ibillboard.service';

describe('IbillboardService', () => {
  let service: IbillboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IbillboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
