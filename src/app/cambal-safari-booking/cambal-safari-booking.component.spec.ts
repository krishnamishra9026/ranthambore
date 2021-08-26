import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambalSafariBookingComponent } from './cambal-safari-booking.component';

describe('CambalSafariBookingComponent', () => {
  let component: CambalSafariBookingComponent;
  let fixture: ComponentFixture<CambalSafariBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambalSafariBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambalSafariBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
