import { TestBed } from '@angular/core/testing';

import { ConexionBackService } from './conexion-back.service';

describe('ConexionBackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConexionBackService = TestBed.get(ConexionBackService);
    expect(service).toBeTruthy();
  });
});
