import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertColorPage } from './convert-color.page';

describe('ConvertColorPage', () => {
  let component: ConvertColorPage;
  let fixture: ComponentFixture<ConvertColorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertColorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertColorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
