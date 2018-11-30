import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RgbsettingsComponent } from './rgbsettings.component';

describe('RgbsettingsComponent', () => {
  let component: RgbsettingsComponent;
  let fixture: ComponentFixture<RgbsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RgbsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RgbsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
