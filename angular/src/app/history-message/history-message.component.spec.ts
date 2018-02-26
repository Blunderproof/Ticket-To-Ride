import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryMessageComponent } from './history-message.component';

describe('HistoryMessageComponent', () => {
  let component: HistoryMessageComponent;
  let fixture: ComponentFixture<HistoryMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
