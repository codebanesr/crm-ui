import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeadCreateComponent } from './lead-create.component';

describe('LeadCreateComponent', () => {
  let component: LeadCreateComponent;
  let fixture: ComponentFixture<LeadCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadCreateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
