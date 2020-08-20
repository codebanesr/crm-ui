import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadSoloComponent } from './lead-solo.component';

describe('LeadSoloComponent', () => {
  let component: LeadSoloComponent;
  let fixture: ComponentFixture<LeadSoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadSoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
