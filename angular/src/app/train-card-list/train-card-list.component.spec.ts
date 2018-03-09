import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainCardListComponent } from './train-card-list.component';

describe('TrainCardListComponent', () => {
  let component: TrainCardListComponent;
  let fixture: ComponentFixture<TrainCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
