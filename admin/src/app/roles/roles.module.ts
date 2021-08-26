import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SharedModule } from '../_shared/shared.module';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesService } from './roles.service';

@NgModule({
	declarations: [ ListComponent, ManageComponent ],
	imports: [ CommonModule, SharedModule, RolesRoutingModule ],
	entryComponents: [ ManageComponent ],
	providers: [ RolesService ]
})
export class RolesModule {}
