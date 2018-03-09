import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestCardSelectorComponent } from './dest-card-selector.component';

describe('DestCardSelectorComponent', () => {
  let component: DestCardSelectorComponent;
  let fixture: ComponentFixture<DestCardSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestCardSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestCardSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
