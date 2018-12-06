import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiferenciaColorPage } from './diferencia-color.page';

describe('DiferenciaColorPage', () => {
  let component: DiferenciaColorPage;
  let fixture: ComponentFixture<DiferenciaColorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiferenciaColorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiferenciaColorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
