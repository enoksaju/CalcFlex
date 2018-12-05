import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmysettingsComponent } from './cmysettings.component';

describe('CmysettingsComponent', () => {
  let component: CmysettingsComponent;
  let fixture: ComponentFixture<CmysettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmysettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmysettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
