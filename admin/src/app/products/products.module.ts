import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';

import { ProductsRoutingModule } from './products-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

@NgModule({
	declarations: [ ListComponent, ManageComponent ],
	imports: [ CommonModule, SharedModule, ProductsRoutingModule ],
	entryComponents: [ ManageComponent ]
})
export class ProductsModule {}
