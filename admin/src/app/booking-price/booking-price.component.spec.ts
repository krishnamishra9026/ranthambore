import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingPriceComponent } from './booking-price.component';

describe('BookingPriceComponent', () => {
  let component: BookingPriceComponent;
  let fixture: ComponentFixture<BookingPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
