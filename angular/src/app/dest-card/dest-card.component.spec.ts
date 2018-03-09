import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestCardComponent } from './dest-card.component';

describe('DestCardComponent', () => {
  let component: DestCardComponent;
  let fixture: ComponentFixture<DestCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
