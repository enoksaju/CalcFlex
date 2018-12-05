import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LchsettingsComponent } from './lchsettings.component';

describe('LchsettingsComponent', () => {
  let component: LchsettingsComponent;
  let fixture: ComponentFixture<LchsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LchsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LchsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
