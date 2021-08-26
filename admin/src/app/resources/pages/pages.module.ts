import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesService } from './pages.service';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SharedModule } from 'src/app/_shared/shared.module';

@NgModule({
	imports: [ SharedModule, PagesRoutingModule ],
	declarations: [ ListComponent, ManageComponent ],
	providers: [ PagesService ]
})
export class PagesModule {}
