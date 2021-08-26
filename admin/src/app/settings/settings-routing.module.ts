import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';

const routes: Routes = [
	{
		path: ':type',
		component: SettingsComponent,
		data: { breadcrumb: '', permission: 'update_setting' }
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class SettingsRoutingModule {}
