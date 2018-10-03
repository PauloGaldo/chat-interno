import { TestBed, inject } from '@angular/core/testing';

import { DeepStreamService } from './deep-stream.service';

describe('DeepStreamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeepStreamService]
    });
  });

  it('should be created', inject([DeepStreamService], (service: DeepStreamService) => {
    expect(service).toBeTruthy();
  }));
});
