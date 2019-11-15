import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './service.index';
import { HttpClientModule } from '@angular/common/http';
import { LoginGuard } from './guards/login.guard';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    LoginGuard
  ]
})
export class ServiceModule { }
