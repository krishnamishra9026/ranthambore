import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-confirm-modal',
	templateUrl: './confirm-modal.component.html',
	styleUrls: [ './confirm-modal.component.scss' ]
})
export class ConfirmModalComponent implements OnInit {
	title = '';
	message = '';
	@Output() response: EventEmitter<boolean> = new EventEmitter();

	constructor() {}

	ngOnInit() {
		this.response = new EventEmitter();
	}

	confirm() {
		this.response.emit(true);
	}

	decline() {
		this.response.emit(false);
	}
}
