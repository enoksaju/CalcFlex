import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HexsettingsComponent } from './hexsettings.component';

describe('HexsettingsComponent', () => {
  let component: HexsettingsComponent;
  let fixture: ComponentFixture<HexsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HexsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
