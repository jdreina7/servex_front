import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'app/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';

@NgModule({
    imports: [
        CommonModule,
        ProductsRoutingModule,
        TranslateModule,
        PipesModule,
        FormsModule
    ],
    declarations: [
        ProductsComponent
    ]
})
export class ProductsModule { }
