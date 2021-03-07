import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListRulesComponent } from './list-rules.component';

describe('ListRulesComponent', () => {
  let component: ListRulesComponent;
  let fixture: ComponentFixture<ListRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRulesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
