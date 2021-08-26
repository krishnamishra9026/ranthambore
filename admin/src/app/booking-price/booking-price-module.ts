import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingPriceService } from './booking-price.service';

import { BookingPriceRoutingModule } from './booking-price-routing.module';
import { BookingPriceComponent } from './booking-price.component';
import { SharedModule } from '../_shared/shared.module';

@NgModule({

	declarations: [ BookingPriceComponent ],
	imports: [ SharedModule, CommonModule , BookingPriceRoutingModule],
	entryComponents: [ BookingPriceComponent ],
		providers: [ BookingPriceService ]
})
export class BookingPriceModule {}