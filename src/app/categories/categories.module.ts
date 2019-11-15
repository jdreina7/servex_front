import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        TranslateModule,
        PipesModule,
        FormsModule
    ],
    declarations: [
        CategoriesComponent
    ]
})
export class CategoriesModule { }
