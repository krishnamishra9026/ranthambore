import { TestBed } from '@angular/core/testing';

import { APIResolverService } from './apiresolver.service';

describe('APIResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: APIResolverService = TestBed.get(APIResolverService);
    expect(service).toBeTruthy();
  });
});
