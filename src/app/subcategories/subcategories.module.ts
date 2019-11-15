import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcategoriesRoutingModule } from './subcategories-routing.module';
import { SubcategoriesComponent } from './subcategories.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SubcategoriesRoutingModule,
        TranslateModule,
        PipesModule,
        FormsModule
    ],
    declarations: [
        SubcategoriesComponent
    ]
})
export class SubcategoriesModule { }
