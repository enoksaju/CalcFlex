import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoPantPage } from './catalogo-pant.page';

describe('CatalogoPantPage', () => {
  let component: CatalogoPantPage;
  let fixture: ComponentFixture<CatalogoPantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoPantPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoPantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
