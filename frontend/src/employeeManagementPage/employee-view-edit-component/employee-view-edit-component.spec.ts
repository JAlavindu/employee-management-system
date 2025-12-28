import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeViewEditComponent } from './employee-view-edit-component';

describe('EmployeeViewEditComponent', () => {
  let component: EmployeeViewEditComponent;
  let fixture: ComponentFixture<EmployeeViewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeViewEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeViewEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
