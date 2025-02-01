import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { LoginService } from './login.service';

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgClass,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        HttpClientModule,
    ],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss'],
    providers: [LoginService],
})
export class LoginPageComponent {
    loginForm: FormGroup;
    passwordVisible = false;
    passwordConfirmationVisible = false;
    private router = inject(Router);
    private cookieService = inject(CookieService);

    constructor(private fb: FormBuilder, private loginService: LoginService) {
        this.loginForm = this.fb.group({
            emailOrPhone: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            password_confirmation: [
                '',
                [Validators.required, Validators.minLength(8)],
            ],
        });
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    togglePasswordConfirmationVisibility() {
        this.passwordConfirmationVisible = !this.passwordConfirmationVisible;
    }

    login() {
        if (this.loginForm.invalid) return;

        this.loginService.login(this.loginForm.value).subscribe({
            next: (response: any) => {
                this.cookieService.set('auth_token', response.token, {
                    expires: 7,
                    path: '/',
                });
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                alert('Login failed. Please check your credentials.');
            },
        });
    }
}
