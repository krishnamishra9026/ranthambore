import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards';
import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';

const routes: Routes = [
	{
		path: 'main',
		canActivate: [ AuthGuard ],
		component: AppLayoutComponent,

		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
			{
				path: 'categories',
				loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule),
				data: { breadcrumb: 'Category', permission: 'list_category' }
			},
			{
				path: 'events',
				loadChildren: () => import('./events/events.module').then(m => m.EventsModule),
				data: { breadcrumb: 'Event', permission: 'list_event' }
			},

			{
				path: 'booking_prices',
				loadChildren: () => import('./booking-prices/booking-prices.module').then(m => m.BookingPricesModule),
				data: { breadcrumb: 'BookingPrices', permission: 'list_booking-prices' }
			},

			{
				path: 'chambal_prices',
				loadChildren: () => import('./chambal-prices/chambal-prices.module').then(m => m.ChambalPricesModule),
				data: { breadcrumb: 'ChambalPrices', permission: 'list_category' }
			},

			{
				path: 'customers',
				loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule),
				data: { breadcrumb: 'Customer', permission: 'list_customer' }
			},

			{
				path: 'cambal-bookings',
				loadChildren: () => import('./cambal-bookings/cambal-bookings.module').then(m => m.CambalBookingsModule),
				data: { breadcrumb: 'CambalBookings', permission: 'list_cambal_bookings' }
			},

			{
				path: 'brand',
				loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule),
				data: { breadcrumb: 'Brand', permission: 'list_brand' }
			},
			{
				path: 'products',
				loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
				data: { breadcrumb: 'Product', permission: 'list_product' }
			},
			{
				path: 'roles',
				loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
				data: { breadcrumb: 'Roles', permission: 'list_roles' }
			},
			{
				path: 'capabilities',
				loadChildren: () => import('./capabilities/capabilities.module').then(m => m.CapabilitiesModule),
				data: {
					breadcrumb: 'Capabilities',
					permission: 'list_capabilities'
				}
			},
			{
				path: 'email',
				loadChildren: () => import('./resources/email/email.module').then(m => m.EmailModule),
				data: { breadcrumb: 'Email', permission: 'list_systememails' }
			},
			{
				path: 'pages',
				loadChildren: () => import('./resources/pages/pages.module').then(m => m.PagesModule),
				data: { breadcrumb: 'Static Page', permission: 'list_page' }
			},
			{
				path: 'faq',
				loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule),
				data: { breadcrumb: 'FAQs', permission: 'list_faq' }
			},
			{
				path: 'settings',
				loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
				data: { breadcrumb: 'Settings', permission: 'update_setting' }
			}
		]
	},
	{
		path: '',
		component: SiteLayoutComponent,
		children: [ { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) } ]
	},
	{
		path: 'home',
		component: SiteLayoutComponent,
		children: [ { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) } ]
	},
	{
		path: '**',
		loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
	}

	//{ path: 'login', loadChildren: './login/login.module#LoginModule' }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
