import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGrayColorModal } from './select-gray-color-modal.component';

describe('SelectGrayColorModal', () => {
  let component: SelectGrayColorModal;
  let fixture: ComponentFixture<SelectGrayColorModal>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SelectGrayColorModal],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGrayColorModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
