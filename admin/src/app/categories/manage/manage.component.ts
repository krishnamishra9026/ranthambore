import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/';
import { CategoriesService } from '../categories.service';
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
	public categoryList: any[];
	categoryId: string;
	parentId: string;
	option: any = {};

	constructor(
		private route: ActivatedRoute,
		private commonService: CommonService,
		private categoryService: CategoriesService,
		private fb: FormBuilder
	) {
		this.initForm(this.option);
	}

	ngOnInit() {
		this.response = new EventEmitter();
		this.categoryService.getCategoryDetail(this.categoryId).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.initForm(res.data);
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
		this.categoryService.getParentCategoryList(this.categoryId).subscribe(
			(result: any) => {
				if (result && result.success) {
					this.categoryList = result.data;
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
		if (!this.categoryId) {
			const categoryData = manageCatForm.value;
			this.categoryService.createCategories(categoryData).subscribe(
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
			this.categoryService.updateCategories(this.categoryId, manageCatForm.value).subscribe(
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
		this.manageCatForm = this.fb.group({
			name: new FormControl(values.name ? values.name : '', Validators.compose([ ValidationService.required ])),
			description: new FormControl(values.description ? values.description : ''),
			parent: new FormControl(values.parent ? values.parent : null),
			active: new FormControl(values.active ? values.active : false)
		});
	}
}
