import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpponentCardComponent } from './opponent-card.component';

describe('OpponentCardComponent', () => {
  let component: OpponentCardComponent;
  let fixture: ComponentFixture<OpponentCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpponentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpponentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
