import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingPricesRoutingModule } from './booking-prices-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
	declarations: [ ListComponent ],
	imports: [ SharedModule, CommonModule, BookingPricesRoutingModule ],
})
export class BookingPricesModule {}
