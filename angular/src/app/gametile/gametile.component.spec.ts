import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GametileComponent } from './gametile.component';

describe('GametileComponent', () => {
  let component: GametileComponent;
  let fixture: ComponentFixture<GametileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GametileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GametileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
