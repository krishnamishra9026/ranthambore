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
		component: ManageComponent,
		data: {
			breadcrumb: 'Edit',
			permission: 'update_page'
		},
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class PagesRoutingModule {}
