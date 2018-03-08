import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTrainCardComponent } from './player-train-card.component';

describe('PlayerTrainCardComponent', () => {
  let component: PlayerTrainCardComponent;
  let fixture: ComponentFixture<PlayerTrainCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerTrainCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTrainCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
