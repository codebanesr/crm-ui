import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GeomarkerComponent } from './geomarker.component';

describe('GeomarkerComponent', () => {
  let component: GeomarkerComponent;
  let fixture: ComponentFixture<GeomarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeomarkerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GeomarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
