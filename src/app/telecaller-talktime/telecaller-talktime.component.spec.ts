import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TelecallerTalktimeComponent } from './telecaller-talktime.component';

describe('TelecallerTalktimeComponent', () => {
  let component: TelecallerTalktimeComponent;
  let fixture: ComponentFixture<TelecallerTalktimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelecallerTalktimeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TelecallerTalktimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});