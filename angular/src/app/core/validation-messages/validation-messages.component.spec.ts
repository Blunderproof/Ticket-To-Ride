import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationMessagesComponent } from './validation-messages.component';

describe('ValidationMessagesComponent', () => {
  let component: ValidationMessagesComponent;
  let fixture: ComponentFixture<ValidationMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
