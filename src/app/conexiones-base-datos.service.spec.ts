import { TestBed } from '@angular/core/testing';

import { ConexionesBaseDatosService } from './conexiones-base-datos.service';

describe('ConexionesBaseDatosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConexionesBaseDatosService = TestBed.get(ConexionesBaseDatosService);
    expect(service).toBeTruthy();
  });
});
