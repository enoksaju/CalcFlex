import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmyksettingsComponent } from './cmyksettings.component';

describe('CmyksettingsComponent', () => {
  let component: CmyksettingsComponent;
  let fixture: ComponentFixture<CmyksettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmyksettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmyksettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
