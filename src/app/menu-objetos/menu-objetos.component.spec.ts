import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuObjetosComponent } from './menu-objetos.component';

describe('MenuObjetosComponent', () => {
  let component: MenuObjetosComponent;
  let fixture: ComponentFixture<MenuObjetosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuObjetosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuObjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
