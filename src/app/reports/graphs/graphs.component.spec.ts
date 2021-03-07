import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraphsComponent } from './graphs.component';

describe('GraphsComponent', () => {
  let component: GraphsComponent;
  let fixture: ComponentFixture<GraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
