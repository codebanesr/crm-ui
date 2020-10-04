import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeadsComponent } from './leads.component';

describe('LeadsComponent', () => {
  let component: LeadsComponent;
  let fixture: ComponentFixture<LeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
