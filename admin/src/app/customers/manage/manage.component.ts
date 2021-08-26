import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/';
import { CustomersService } from '../customers.service';
import { ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit {
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	manageCatForm: FormGroup;
	submitted = false;
	public customrList: any[];
	customerId: string;
	parentId: string;
	option: any = {};
	myData: any[] = [];
	pdf_file_link = '';
	show_generate = false;
	show_view = false;
	zoneEditForm: FormGroup; //These are variables
	zone: any;

	constructor(
		private route: ActivatedRoute,
		private commonService: CommonService,
		private customerService: CustomersService,
		private fb: FormBuilder,
	) {
		this.initForm(this.option);
	}

	ngOnInit() {

		this.zoneEditForm = new FormGroup({
			zone: new FormControl('',
			  Validators.compose([
				Validators.required
			]))
		  });

		this.response = new EventEmitter();
		this.customerService.getPdfFile({ 'customer_id' : this.customerId }).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.pdf_file_link = res.message;
					this.show_view = true;
					this.show_generate = false;
				}else{
					this.pdf_file_link = '';
					this.show_view = false;
					this.show_generate = true;
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
		this.customerService.getCustomerDetail(this.customerId).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.initForm(res.data);
					//console.log(res.data[0]['orderdetails'][0]['zone']);
					if(res.data[0]['orderdetails'][0]['zone'] == 'Zone1'){
						res.data[0]['orderdetails'][0]['zone'] = 'Zone 1/2/3/4/5'
					}else{
						res.data[0]['orderdetails'][0]['zone'] = 'Zone 6/7/8/9/10'
					}

					this.myData = res.data;
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
	}

	renderfile(){
		window.open(this.pdf_file_link, '_blank');
	}
	save(manageCatForm: FormGroup) {
		this.submitted = true;

		if (manageCatForm.invalid) {
			return false;
		}
		if (!this.customerId) {
			const customerData = manageCatForm.value;
			this.customerService.createCustomers(customerData).subscribe(
				(res: any) => {
					if (res && res.success) {
						this.response.emit(res);
					} else {
						this.commonService.showError('', res.message);
					}
				},
				(err: any) => {
					this.commonService.showError('', err.error.message);
				}
			);
		} else {
			this.customerService.updateCustomers(this.customerId, manageCatForm.value).subscribe(
				(res: any) => {
					if (res && res.success) {
						this.response.emit(res);
					} else {
						this.commonService.showError('', res.message);
					}
				},
				(err) => {
					this.commonService.showError('', err.message);
				}
			);
		}
	}
	close() {
		this.response.emit();
	}

	public generatePdfFile(){
	this.customerService.generatePdfFile({'customer_id' : this.customerId}).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.pdf_file_link = res.message;
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
	}

	private initForm(values: any) {
		this.manageCatForm = this.fb.group({
			name: new FormControl(values.name ? values.name : '', Validators.compose([ ValidationService.required ])),
			description: new FormControl(values.description ? values.description : ''),
			parent: new FormControl(values.parent ? values.parent : null),
			active: new FormControl(values.active ? values.active : false)
		});
	}


	sendVoucher(){
		
		this.customerService.sendVoucher({'customer_id' : this.customerId}).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.commonService.showError('', res.success);
				}
			},
			(error: any) => {
				this.commonService.showError('', error.message);
			}
		);
	}

	mdfLogin(data: { zone: any}) {
		this.zone = data.zone;

		this.customerService.generatePdfFile({'customer_id' : this.customerId , 'zone' : this.zone}).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.pdf_file_link = res.message;
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
		//alert(JSON.stringify(data));
	  }
	
}
