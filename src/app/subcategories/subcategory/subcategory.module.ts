import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoryRoutingModule } from './subcategory-routing.module';

import { SubcategoryComponent } from './subcategory.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollingModule } from '@angular/cdk/scrolling'

@NgModule({
    imports: [
        CommonModule,
        SubcategoryRoutingModule,
        TranslateModule,
        PipesModule,
        FormsModule,
        UiSwitchModule,
        NgbAlertModule,
        NgSelectModule,
        ScrollingModule
    ],
    declarations: [
        SubcategoryComponent
    ]
})
export class SubcategoryModule { }
