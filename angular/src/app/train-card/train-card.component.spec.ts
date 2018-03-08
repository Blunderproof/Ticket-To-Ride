import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainCardComponent } from './train-card.component';

describe('TrainCardComponent', () => {
  let component: TrainCardComponent;
  let fixture: ComponentFixture<TrainCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
