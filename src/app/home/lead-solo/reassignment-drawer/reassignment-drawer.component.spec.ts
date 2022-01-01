import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReassignmentDrawerComponent } from './reassignment-drawer.component';

describe('ReassignmentDrawerComponent', () => {
  let component: ReassignmentDrawerComponent;
  let fixture: ComponentFixture<ReassignmentDrawerComponent>;

  beforeEach(waitForAsync(() => {
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
