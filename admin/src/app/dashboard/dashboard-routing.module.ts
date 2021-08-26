import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AppLayoutComponent } from '../_layout/app-layout/app-layout.component';

const routes: Routes = [
	// {
	// 	path: '',
	// 	component: AppLayoutComponent,
	// 	children: [ { path: 'dashboard', component: DashboardComponent } ]
	// }
	{ path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DashboardRoutingModule {}
