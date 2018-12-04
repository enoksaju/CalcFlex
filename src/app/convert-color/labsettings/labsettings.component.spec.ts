import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabsettingsComponent } from './labsettings.component';

describe('LabsettingsComponent', () => {
  let component: LabsettingsComponent;
  let fixture: ComponentFixture<LabsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
