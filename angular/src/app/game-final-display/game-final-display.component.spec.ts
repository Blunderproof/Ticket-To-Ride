import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFinalDisplayComponent } from './game-final-display.component';

describe('GameFinalDisplayComponent', () => {
  let component: GameFinalDisplayComponent;
  let fixture: ComponentFixture<GameFinalDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameFinalDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameFinalDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
