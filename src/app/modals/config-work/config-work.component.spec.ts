import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigWorkComponent } from './config-work.component';

describe('ConfigWorkComponent', () => {
  let component: ConfigWorkComponent;
  let fixture: ComponentFixture<ConfigWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
