import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserCallDurationComponent } from './user-call-duration.component';

describe('UserCallDurationComponent', () => {
  let component: UserCallDurationComponent;
  let fixture: ComponentFixture<UserCallDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCallDurationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCallDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
