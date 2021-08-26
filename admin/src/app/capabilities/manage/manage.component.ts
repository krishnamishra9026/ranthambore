import { Component, OnInit, ViewChild, ElementRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';

import { CapabilitiesService } from './../capabilities.service';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_services';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit, OnDestroy {
	capabilityForm: FormGroup;
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	subscription: Subscription;

	capabilityTypes = [ 'custom', 'crud' ];
	selectedModule: any;
	crudOption = [ 'add', 'update', 'list', 'delete' ];
	public targets = [ '_blank', '_self' ];
	types: object = {
		add: false,
		update: false,
		list: false,
		delete: false
	};
	isValidateAll = true;
	capabilityType: String = 'custom';
	modules: any[] = [];
	submitted: boolean;

	constructor(
		private fb: FormBuilder,
		private capabilitiesService: CapabilitiesService,
		private toastrService: ToastrService,
		private coreService: CommonService
	) {
		this.capabilityForm = this.fb.group({
			name: new FormControl('', Validators.compose([ ValidationService.required ])),
			selectedModule: new FormControl('', Validators.compose([ ValidationService.required ]))
		});
	}

	ngOnInit() {
		this.submitted = false;
		this.capabilitiesService.getModules().subscribe(
			(result: any) => {
				if (result && result.success) {
					this.modules = result.data;
				}
			},
			(error: any) => {
				this.toastrService.error(error);
			}
		);
		this.capabilityType = this.capabilityTypes[0];
	}

	selecteType(type) {
		this.capabilityType = type;
		this.types = {
			add: false,
			update: false,
			list: false,
			delete: false
		};
	}

	checkboxChange(op, event: any) {
		this.types[op] = event.currentTarget.checked;
	}
	saveCapability() {
		this.submitted = true;
		this.isValidateAll = true;

		if (this.capabilityType) {
			if (this.capabilityType === 'crud') {
				let isCheckedAny: boolean;
				this.crudOption.forEach((element) => {
					if (this.types[element]) {
						isCheckedAny = true;
					}
				});
				if (!isCheckedAny) {
					this.isValidateAll = false;
					this.toastrService.error('Please select at least 1 capability');
				}
			} else {
				if (!this.capabilityForm.get('name').value) {
					this.isValidateAll = false;
					this.toastrService.error('Please enter name');
				}
			}
		} else {
			this.isValidateAll = false;
			this.toastrService.error('Please fill required fields');
		}

		if (!this.capabilityForm.get('selectedModule').value && this.isValidateAll) {
			this.isValidateAll = false;
			this.toastrService.error('Please select module');
		}

		if (this.isValidateAll) {
			let obj: any;
			obj = {
				type: this.capabilityType,
				name: this.capabilityType === 'custom' ? this.capabilityForm.get('name').value : '',
				module: this.capabilityForm.get('selectedModule').value,
				types: this.types
			};
			this.capabilitiesService.saveCapabilities(obj).subscribe(
				(res: any) => {
					if (res && res.success) {
						this.toastrService.success(res.message);
						this.response.emit(res);
					} else {
						this.submitted = false;
						this.toastrService.error(res.message);
					}
				},
				(err) => {
					this.toastrService.error(err.error.message);
				}
			);
		}
	}
	ngOnDestroy() {}
	close() {
		this.response.emit();
	}
}
