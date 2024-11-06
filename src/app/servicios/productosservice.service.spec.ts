import { TestBed } from '@angular/core/testing';

import { ProductosserviceService } from './productosservice.service';

describe('ProductosserviceService', () => {
  let service: ProductosserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductosserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
