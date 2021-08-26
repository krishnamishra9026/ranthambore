import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambalBookingComponent } from './chambal-booking.component';

describe('ChambalBookingComponent', () => {
  let component: ChambalBookingComponent;
  let fixture: ComponentFixture<ChambalBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChambalBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChambalBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
