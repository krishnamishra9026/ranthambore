import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/_services';
import { BrandsService } from '../brands.service';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit {
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	manageBrandForm: FormGroup;
	submitted = false;
	public BrandList: any[];
	brandId: string;
	option: any = {};

	constructor(private commonService: CommonService, private brandService: BrandsService, private fb: FormBuilder) {
		this.initForm(this.option);
	}

	ngOnInit() {
		this.response = new EventEmitter();
		this.brandService.getBrandDetail(this.brandId).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.initForm(res.data);
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
	}

	save(manageCatForm: FormGroup) {
		this.submitted = true;

		if (manageCatForm.invalid) {
			return false;
		}
		if (!this.brandId) {
			const categoryData = manageCatForm.value;
			this.brandService.createBrand(categoryData).subscribe(
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
			console.log(manageCatForm.value);
			this.brandService.updateBrands(this.brandId, manageCatForm.value).subscribe(
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
	private initForm(values: any) {
		this.manageBrandForm = this.fb.group({
			name: new FormControl(values.name ? values.name : '', Validators.compose([ ValidationService.required ])),
			active: new FormControl(values.active ? values.active : false)
		});
	}
}
