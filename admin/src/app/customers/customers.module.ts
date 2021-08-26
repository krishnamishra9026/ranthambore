import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../_shared/shared.module';
import { ManageComponent } from './manage/manage.component';

@NgModule({
	declarations: [ ListComponent, ManageComponent ],
	imports: [ SharedModule, CommonModule, CustomersRoutingModule ],
	entryComponents: [ ManageComponent ],
})
export class CustomersModule {}
