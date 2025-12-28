import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeViewTableComponent } from './employee-view-table-component';

describe('EmployeeViewTableComponent', () => {
  let component: EmployeeViewTableComponent;
  let fixture: ComponentFixture<EmployeeViewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeViewTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeViewTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
