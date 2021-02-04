import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReassignmentDrawerComponent } from './reassignment-drawer.component';

describe('ReassignmentDrawerComponent', () => {
  let component: ReassignmentDrawerComponent;
  let fixture: ComponentFixture<ReassignmentDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignmentDrawerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReassignmentDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
