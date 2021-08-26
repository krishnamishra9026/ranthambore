import { Component, ViewEncapsulation } from '@angular/core';
// import { AppSettings } from '../../app.settings';
// import { Settings } from '../../app.settings.model';
import { orders, products, customers, refunds } from '../dashboard.data';

@Component({
	selector: 'app-info-cards',
	templateUrl: './info-cards.component.html',
	encapsulation: ViewEncapsulation.None
})
export class InfoCardsComponent {
	public orders: any[];
	public products: any[];
	public customers: any[];
	public refunds: any[];

	public colorScheme = {
		domain: [ '#eee' ]
	};
	public autoScale = true;

	public previousShowMenuOption: boolean;
	public previousMenuOption: string;
	public previousMenuTypeOption: string;
	//public settings: Settings;
	constructor() //public appSettings: AppSettings
	{
		//this.settings = this.appSettings.settings;
		//this.initPreviousSettings();
	}

	ngOnInit() {
		this.orders = orders;
		this.products = products;
		this.customers = customers;
		this.refunds = refunds;
		this.orders = this.addRandomValue('orders');
		this.customers = this.addRandomValue('customers');
	}

	public onSelect(event) {
		console.log(event);
	}

	public addRandomValue(param) {
		switch (param) {
			case 'orders':
				for (let i = 1; i < 30; i++) {
					this.orders[0].series.push({
						name: 1980 + i,
						value: Math.ceil(Math.random() * 1000000)
					});
				}
				return this.orders;
			case 'customers':
				for (let i = 1; i < 15; i++) {
					this.customers[0].series.push({
						name: 2000 + i,
						value: Math.ceil(Math.random() * 1000000)
					});
				}
				return this.customers;
			default:
				return this.orders;
		}
	}

	ngOnDestroy() {
		this.orders[0].series.length = 0;
		this.customers[0].series.length = 0;
	}

	public ngDoCheck() {
		setTimeout(() => (this.orders = [ ...orders ]));
		setTimeout(() => (this.products = [ ...products ]));
		setTimeout(() => (this.customers = [ ...customers ]));
		setTimeout(() => (this.refunds = [ ...refunds ]));
	}

	// public checkAppSettingsChanges() {
	// 	if (
	// 		this.previousShowMenuOption != this.settings.theme.showMenu ||
	// 		this.previousMenuOption != this.settings.theme.menu ||
	// 		this.previousMenuTypeOption != this.settings.theme.menuType
	// 	) {
	// 		return true;
	// 	}
	// 	return false;
	// }

	// public initPreviousSettings() {
	// 	this.previousShowMenuOption = this.settings.theme.showMenu;
	// 	this.previousMenuOption = this.settings.theme.menu;
	// 	this.previousMenuTypeOption = this.settings.theme.menuType;
	// }
}
