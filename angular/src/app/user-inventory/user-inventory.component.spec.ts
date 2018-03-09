import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInventoryComponent } from './user-inventory.component';

describe('UserInventoryComponent', () => {
  let component: UserInventoryComponent;
  let fixture: ComponentFixture<UserInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
