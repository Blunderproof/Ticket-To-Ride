import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamelobbyComponent } from './gamelobby.component';

describe('GamelobbyComponent', () => {
  let component: GamelobbyComponent;
  let fixture: ComponentFixture<GamelobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamelobbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamelobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
