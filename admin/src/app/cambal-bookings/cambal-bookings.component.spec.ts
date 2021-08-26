import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambalBookingsComponent } from './cambal-bookings.component';

describe('CambalBookingsComponent', () => {
  let component: CambalBookingsComponent;
  let fixture: ComponentFixture<CambalBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambalBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambalBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
