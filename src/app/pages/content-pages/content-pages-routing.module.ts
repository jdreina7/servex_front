import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorPageComponent } from './error/error-page.component';
import { LoginPageComponent } from './login/login-page.component';
import { ServexgalleryComponent } from './servexgallery/servexgallery/servexgallery.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'error',
        component: ErrorPageComponent,
        data: {
          title: 'Error Page'
        }
      },

      {
        path: 'servexgallery',
        component: ServexgalleryComponent,
        data: {
          title: 'Servex Gallery'
        }
      },
      {
        path: 'login',
        component: LoginPageComponent,
        data: {
          title: 'Login Page'
        }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule { }
