import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansAdmin } from './loans-admin';

describe('LoansAdmin', () => {
  let component: LoansAdmin;
  let fixture: ComponentFixture<LoansAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
