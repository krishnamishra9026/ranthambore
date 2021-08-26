import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/';
import { EventsService } from '../events.service';
import { ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit {
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	manageEventForm: FormGroup;
	submitted = false;
	public EventList: any[];

	public vehicleList: any[];
	public timingList: any[];
	public zoneList: any[];

	eventId: string;
	option: any = {};

	constructor(
		private route: ActivatedRoute,
		private commonService: CommonService,
		private eventService: EventsService,
		private fb: FormBuilder
	) {
		this.initForm(this.option);
	}

	ngOnInit() {
	
		this.response = new EventEmitter();
		this.eventService.getEventDetail(this.eventId).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.initForm(res.data);
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
		this.eventService.getParentEventList(this.eventId).subscribe(
			(result: any) => {
				if (result && result.success) {
					this.EventList = result.data;
					this.vehicleList =  [{"name":"Canter"} ,{ "name":"Gypsy"}];
					this.timingList =  [{"name":"Morning"} ,{ "name":"Evening"}];
					this.zoneList =  [{"name1" : "Zone1","name":"Zone 1/2/3/4/5"} ,{ "name1" : "Zone2", "name":"Zone 6/7/8/9/10"}];
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
	}
	save(manageEventForm: FormGroup) {
	console.log(manageEventForm.value);
		this.submitted = true;

		if (manageEventForm.invalid) {
			return false;
		}
		if (!this.eventId) {
			const eventData = manageEventForm.value;
			console.log(eventData);
			this.eventService.createEvents(eventData).subscribe(
				(res: any) => {
				console.log(res);
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
			this.eventService.updateEvents(this.eventId, manageEventForm.value).subscribe(
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
		this.manageEventForm = this.fb.group({
			date: new FormControl(values.date ? values.date : '', Validators.compose([ ValidationService.required ])),
			zone: new FormControl(values.zone ? values.zone : '', Validators.compose([ ValidationService.required ])),
			vehicle: new FormControl(values.vehicle ? values.vehicle : '', Validators.compose([ ValidationService.required ])),
			timing: new FormControl(values.timing ? values.timing : '', Validators.compose([ ValidationService.required ])),
			availability: new FormControl(values.availability ? values.availability : '', Validators.compose([ ValidationService.required ])),
			active: new FormControl(values.active ? values.active : false)
		});
	}
}
