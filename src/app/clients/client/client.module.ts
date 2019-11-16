import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';

import { ClientComponent } from './client.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        ClientRoutingModule,
        TranslateModule,
        PipesModule,
        FormsModule,
        NgSelectModule
    ],
    declarations: [
        ClientComponent
    ]
})
export class ClientModule { }
