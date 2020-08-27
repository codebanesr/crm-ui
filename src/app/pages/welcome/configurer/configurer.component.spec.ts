import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurerComponent } from './configurer.component';

describe('ConfigurerComponent', () => {
  let component: ConfigurerComponent;
  let fixture: ComponentFixture<ConfigurerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
