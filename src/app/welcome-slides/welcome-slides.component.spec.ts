import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WelcomeSlidesComponent } from './welcome-slides.component';

describe('WelcomeSlidesComponent', () => {
  let component: WelcomeSlidesComponent;
  let fixture: ComponentFixture<WelcomeSlidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeSlidesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
