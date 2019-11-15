import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ClientsRoutingModule,
        TranslateModule,
        PipesModule,
        FormsModule
    ],
    declarations: [
        ClientsComponent
    ]
})
export class ClientsModule { }
