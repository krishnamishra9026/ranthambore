import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {
	@Input('appNumberOnly') appNumberOnly: number;
	constructor(private el: ElementRef, public model: NgControl) {}
	@HostListener('input', [ '$event' ])
	onEvent($event) {
		let value: string = this.el.nativeElement.value.replace(/[^0-9]/g, '');
		let newVal: number;

		if (!value) {
			newVal = undefined;
		} else {
			if (value.length > this.appNumberOnly) {
				value = value.slice(0, -1);
			}

			newVal = +value;
		}
		this.model.control.setValue(newVal);
	}
}
