import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeadSoloComponent } from './lead-solo.component';

describe('LeadSoloComponent', () => {
  let component: LeadSoloComponent;
  let fixture: ComponentFixture<LeadSoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadSoloComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
