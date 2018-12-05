import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XyzsettingsComponent } from './xyzsettings.component';

describe('XyzsettingsComponent', () => {
  let component: XyzsettingsComponent;
  let fixture: ComponentFixture<XyzsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XyzsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XyzsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
