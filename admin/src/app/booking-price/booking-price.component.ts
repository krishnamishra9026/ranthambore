import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { BookingPriceService } from './booking-price.service';
import { CommonService } from 'src/app/_services/';
@Component({
  selector: 'app-booking-price',
  templateUrl: './booking-price.component.html',
  styleUrls: ['./booking-price.component.scss']
})
export class BookingPriceComponent implements OnInit {
editBookingPriceForm: FormGroup;
	loading = false;
	submitted = false;
	bookingPriceInfo: any;
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	constructor(
		private formBuilder: FormBuilder,
		private bookingPriceService: BookingPriceService,
		private commonService: CommonService,
	) { }

	ngOnInit() {
		this.bookingPriceInfo = this.bookingPriceService.getBookingPrice();
		console.log(this.bookingPriceService.getBookingPrice());
		console.log('nnn');
		this.editBookingPriceForm = this.formBuilder.group({
			indian_price: [this.bookingPriceInfo.indian_price ? this.bookingPriceInfo.indian_price : null, Validators.required],
			foreigner_price: [this.bookingPriceInfo.foreigner_price ? this.bookingPriceInfo.foreigner_price : null, [Validators.required]],
		});
	}

	get editProFrm() {
		return this.editBookingPriceForm.controls;
	}

	editBookingPrice() {
		this.submitted = true;
		if (this.editBookingPriceForm.invalid) {
			return false;
		}
		const formdata = new FormData();
		formdata.append('indian_price', this.editBookingPriceForm.controls.indian_price.value);
		formdata.append('foreigner_price', this.editBookingPriceForm.controls.foreigner_price.value);

		this.bookingPriceService.updateBookingPrice(formdata).subscribe(
			(res: any) => {
				if (res && res.success) {
					//this.bookingPriceService.storeUserInfo('res.data');
					this.response.emit(res);
				} else {
					this.commonService.showError('', 'error');
				}
			},
			(err: any) => {
				this.commonService.showError('','err.error.message');
			}
		);
	}
}
