import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { APIResolverService } from 'src/app/_services/apiresolver.service';

const routes: Routes = [
	{
		path: '',
		component: ListComponent,
		pathMatch: 'true'
	},
	{
		component: ManageComponent,
		data: {
			breadcrumb: 'Edit',
			detailApi: '/system-emails/',
			redirectTo: '/email'
		},
		pathMatch: 'true'
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class EmailRoutingModule {}
