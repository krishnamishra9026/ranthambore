import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../_shared/shared.module';

import { InfoPanelsComponent } from './info-panels/info-panels.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { TodoComponent } from './todo/todo.component';

@NgModule({
	declarations: [ DashboardComponent, InfoPanelsComponent, InfoCardsComponent, TodoComponent ],
	imports: [ CommonModule, NgxChartsModule, DashboardRoutingModule, SharedModule ]
})
export class DashboardModule {}
