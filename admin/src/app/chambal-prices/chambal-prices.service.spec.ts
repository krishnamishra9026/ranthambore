import { TestBed } from '@angular/core/testing';

import { ChambalPricesService } from './chambal-prices.service';

describe('ChambalPricesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChambalPricesService = TestBed.get(ChambalPricesService);
    expect(service).toBeTruthy();
  });
});
