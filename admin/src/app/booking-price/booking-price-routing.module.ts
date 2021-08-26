import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingPriceComponent } from './booking-price.component';

const routes: Routes = [
	{
		path: '',
		component: BookingPriceComponent,
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class BookingPriceRoutingModule {}


