import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContentPagesRoutingModule } from './content-pages-routing.module';

import { ComingSoonPageComponent } from './coming-soon/coming-soon-page.component';
import { ErrorPageComponent } from './error/error-page.component';
import { ForgotPasswordPageComponent } from './forgot-password/forgot-password-page.component';
import { LockScreenPageComponent } from './lock-screen/lock-screen-page.component';
import { LoginPageComponent } from './login/login-page.component';
import { MaintenancePageComponent } from './maintenance/maintenance-page.component';
import { RegisterPageComponent } from './register/register-page.component';
import { ServexgalleryComponent } from './servexgallery/servexgallery/servexgallery.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from '../../pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';


@NgModule({
    imports: [
        CommonModule,
        ContentPagesRoutingModule,
        FormsModule,
        NgSelectModule,
        PipesModule,
        HttpClientModule,
        HttpModule,
        FileUploadModule
    ],
    declarations: [
        ComingSoonPageComponent,
        ErrorPageComponent,
        ForgotPasswordPageComponent,
        LockScreenPageComponent,
        LoginPageComponent,
        MaintenancePageComponent,
        RegisterPageComponent,
        ServexgalleryComponent
    ]
})
export class ContentPagesModule { }
