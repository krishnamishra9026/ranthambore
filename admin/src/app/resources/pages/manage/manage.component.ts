import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PagesService } from './../pages.service';
import { Subscription } from 'rxjs';

import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services';
import { SharedService } from 'src/app/_shared/shared.service';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
	selector: 'ngx-manage',
	templateUrl: './manage.component.html',
	styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit, OnDestroy {
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	public managePageForm: FormGroup;
	subscription: Subscription;
	submitted = false;
	pageId: string;
	public config: any;
	page: any = {
		name: '',
		code: '',
		description: '',
		url: '',
		active: true,
		metadata: {
			keyword: '',
			description: '',
			title: ''
		}
	};
	rows = [];
	pageInfo: any = {
		count: 0,
		pageNumber: 0,
		offset: 0,
		pageSize: 10
	};
	constructor(
		private toastrService: ToastrService,
		private pageService: PagesService,
		private commonService: CommonService,
		private fb: FormBuilder
	) {
		this.config = this.commonService.ckEditorConfig;
		this.initForm();
	}
	ngOnInit() {
		this.config.removeButtons = 'Underline,Subscript,Superscript,SpecialChar,Source';
		this.submitted = false;
		this.pageService.getPageDetails(this.pageId).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.page = res.data;
					this.initForm();
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
	}
	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
	savepages() {
		this.submitted = true;
		if (this.managePageForm.valid) {
			const formData = this.managePageForm.value;
			if (this.pageId) {
				this.pageService.updatePage(formData, this.pageId).subscribe(
					(res: any) => {
						if (res && res.success) {
							this.response.emit(res);
						} else {
							this.toastrService.error(res.message);
						}
					},
					(error: any) => {
						this.toastrService.error(error);
					}
				);
			}
		}
	}
	close() {
		this.response.emit();
	}

	private initForm() {
		this.managePageForm = this.fb.group({
			name: new FormControl(this.page.name, Validators.compose([ ValidationService.required ])),
			code: new FormControl(this.page.code, Validators.compose([ ValidationService.required ])),
			description: new FormControl(this.page.description, Validators.compose([ ValidationService.required ])),
			url: new FormControl(this.page.url, Validators.compose([ ValidationService.required ])),
			metadata: this.fb.group({
				keyword: new FormControl(
					this.page.metadata.keyword,
					Validators.compose([ ValidationService.required ])
				),
				title: new FormControl(this.page.metadata.title, Validators.compose([ ValidationService.required ])),
				description: new FormControl(
					this.page.metadata.description,
					Validators.compose([ ValidationService.required ])
				)
			}),
			active: new FormControl(this.page.active)
		});
	}
}
