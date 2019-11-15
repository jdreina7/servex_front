import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryRoutingModule } from './category-routing.module';

import { CategoryComponent } from './category.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        CategoryRoutingModule,
        TranslateModule,
        PipesModule,
        FormsModule,
        UiSwitchModule,
        NgbAlertModule
    ],
    declarations: [
        CategoryComponent
    ]
})
export class CategoryModule { }
