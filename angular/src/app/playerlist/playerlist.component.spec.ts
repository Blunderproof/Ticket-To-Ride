import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerlistComponent } from './playerlist.component';

describe('PlayerlistComponent', () => {
  let component: PlayerlistComponent;
  let fixture: ComponentFixture<PlayerlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
