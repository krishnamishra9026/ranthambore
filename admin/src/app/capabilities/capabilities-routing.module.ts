import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
	{
		path: '',
		component: ListComponent,
		pathMatch: 'full'
	},
	{
		path: 'create',
		component: ManageComponent,
		pathMatch: 'full',
		data: { breadcrumb: 'Create', permission: null }
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class CapabilitiesRoutingModule {}
