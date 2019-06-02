import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraccionTablaComponent } from './extraccion-tabla.component';

describe('ExtraccionTablaComponent', () => {
  let component: ExtraccionTablaComponent;
  let fixture: ComponentFixture<ExtraccionTablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraccionTablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraccionTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
