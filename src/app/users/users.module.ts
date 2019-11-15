import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';

import { UsersComponent } from './users.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'app/pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule,
        TranslateModule,
        PipesModule
    ],
    declarations: [
        UsersComponent
    ]
})
export class UsersModule { }
