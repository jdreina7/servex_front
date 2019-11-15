import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/service.index';
import { User } from '../../../models/users.model';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

    @ViewChild('f') loginForm: NgForm;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public _userService: UserService
        ) { }

    // On submit button click
    login(forma: NgForm ) {

        if (forma.invalid) {
            return;
        }

        const usuario = new User(null, null, forma.value.email, forma.value.password, null, null);

        this._userService.login(usuario)
                         .subscribe( resp => this.router.navigate(['/dashboard/dashboard1']));
    }

    // On Forgot password link click
    onForgotPassword() {
        this.router.navigate(['forgotpassword'], { relativeTo: this.route.parent });
    }
    // On registration link click
    onRegister() {
        this.router.navigate(['register'], { relativeTo: this.route.parent });
    }
}
