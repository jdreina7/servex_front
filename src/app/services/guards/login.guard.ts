import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    public _userService: UserService,
    public router: Router
  ) {}

  canActivate() {

    if (this._userService.isLogued()) {
      console.log('paso por el login guard');
      return true;
    } else {
      console.log('BLOQUEADO POR EL GUARD');
      // tslint:disable-next-line:no-unused-expression
      this.router.navigate(['/pages/login']);
      return false;
    }

  }

}
