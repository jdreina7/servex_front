import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubcategoriesComponent } from './subcategories.component';

const routes: Routes = [
  {
    path: '',
    component: SubcategoriesComponent,
    data: {
      title: 'Subcategories'
    },

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubcategoriesRoutingModule { }
