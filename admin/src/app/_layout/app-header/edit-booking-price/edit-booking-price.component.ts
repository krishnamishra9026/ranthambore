import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { UserService } from 'src/app/_services/user.service';
import { SharedService } from 'src/app/_shared/shared.service';


@Component({
  selector: 'app-edit-booking-price',
  templateUrl: './edit-booking-price.component.html',
  styleUrls: ['./edit-booking-price.component.scss']
})
export class EditBookingPriceComponent implements OnInit {

editBookingPriceForm: FormGroup;
	loading = false;
	submitted = false;
	bookingPriceInfo: any;
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	constructor(
		private formBuilder: FormBuilder,
		private commonService: CommonService,
		private userService: UserService,
		private sharedService: SharedService
	) { }

	ngOnInit() {
	console.log(this.sharedService.getCategories());
	console.log('sddsdfdsd');

		this.bookingPriceInfo = this.sharedService.getCategories();
		console.log(this.bookingPriceInfo);
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

		this.userService.updateBookingPrice(formdata).subscribe(
			(res: any) => {
				if (res && res.success) {
					//this.userService.storeUserInfo('res.data');
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

	closeModal() {
		this.response.emit();
	}
}

