import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationModal } from './registration-modal';

describe('RegistrationModal', () => {
  let component: RegistrationModal;
  let fixture: ComponentFixture<RegistrationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
