import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLobbyComponent } from './gamelobby.component';

describe('GamelobbyComponent', () => {
  let component: GameLobbyComponent;
  let fixture: ComponentFixture<GameLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameLobbyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
