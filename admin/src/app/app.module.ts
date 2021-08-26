import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { SiteHeaderComponent } from './_layout/site-header/site-header.component';
import { SiteFooterComponent } from './_layout/site-footer/site-footer.component';

import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';
import { AppHeaderComponent } from './_layout/app-header/app-header.component';
import { AppSidebarComponent } from './_layout/app-sidebar/app-sidebar.component';

import { fakeBackendProvider, JwtInterceptor, ErrorInterceptor } from './_helpers';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SharedModule } from './_shared/shared.module';
import { ChangePasswordModalComponent } from './_layout/app-header/change-password-modal/change-password-modal.component';
import { EditProfileComponent } from './_layout/app-header/edit-profile/edit-profile.component';
import { CustomersComponent } from './customers/customers.component';
import { EventsComponent } from './events/events.component';
import { BookingPricesComponent } from './booking-prices/booking-prices.component';
import { ChambalPricesComponent } from './chambal-prices/chambal-prices.component';
import { CambalBookingsComponent } from './cambal-bookings/cambal-bookings.component';
import { EditBookingPriceComponent } from './_layout/app-header/edit-booking-price/edit-booking-price.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};

@NgModule({
	declarations: [
		AppComponent,
		SiteLayoutComponent,
		SiteHeaderComponent,
		SiteFooterComponent,
		AppLayoutComponent,
		AppHeaderComponent,
		AppSidebarComponent,
		EditProfileComponent,
		ChangePasswordModalComponent,
		CustomersComponent,
		EventsComponent,
		BookingPricesComponent,
		ChambalPricesComponent,
		CambalBookingsComponent,
		EditBookingPriceComponent,
		
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		HttpClientModule,
		SharedModule,
		PerfectScrollbarModule,
		NgHttpLoaderModule.forRoot(),
		ToastrModule.forRoot({
			positionClass: 'toast-bottom-right',
			preventDuplicates: true
		})
	],
	entryComponents: [ EditProfileComponent, ChangePasswordModalComponent  , EditBookingPriceComponent],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},

		// provider used to create fake backend
		fakeBackendProvider
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
