import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';

import { ProductComponent } from './product.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

@NgModule({
    imports: [
        CommonModule,
        ProductRoutingModule,
        TranslateModule,
        PipesModule,
        FormsModule,
        UiSwitchModule,
        NgbAlertModule,
        NgSelectModule,
        ScrollingModule,
        FileUploadModule
    ],
    declarations: [
        ProductComponent
    ]
})
export class ProductModule { }
