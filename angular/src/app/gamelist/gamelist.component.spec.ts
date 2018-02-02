import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamelistComponent } from './gamelist.component';

describe('GamelistComponent', () => {
  let component: GamelistComponent;
  let fixture: ComponentFixture<GamelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
