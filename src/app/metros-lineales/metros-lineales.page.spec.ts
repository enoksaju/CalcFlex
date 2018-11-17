import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetrosLinealesPage } from './metros-lineales.page';

describe('MetrosLinealesPage', () => {
  let component: MetrosLinealesPage;
  let fixture: ComponentFixture<MetrosLinealesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetrosLinealesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetrosLinealesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
