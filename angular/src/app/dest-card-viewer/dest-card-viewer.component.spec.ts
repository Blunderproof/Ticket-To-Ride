import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestCardViewerComponent } from './dest-card-viewer.component';

describe('DestCardViewerComponent', () => {
  let component: DestCardViewerComponent;
  let fixture: ComponentFixture<DestCardViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestCardViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestCardViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
