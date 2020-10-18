import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordVerifyComponent } from './forgot-password-verify.component';

describe('ForgotPasswordVerifyComponent', () => {
  let component: ForgotPasswordVerifyComponent;
  let fixture: ComponentFixture<ForgotPasswordVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
