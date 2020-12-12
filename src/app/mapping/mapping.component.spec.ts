import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MappingComponent } from './mapping.component';

describe('MappingComponent', () => {
  let component: MappingComponent;
  let fixture: ComponentFixture<MappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
