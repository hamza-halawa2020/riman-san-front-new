import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
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
        NgIf,
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
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private loginService: LoginService
    ) {
        this.loginForm = this.fb.group({
            emailOrPhone: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            password_confirmation: [
                '',
                [Validators.required, this.passwordMatchValidator()],
            ],
        });
    }

    passwordMatchValidator(): (
        control: AbstractControl
    ) => { [key: string]: boolean } | null {
        return (control: AbstractControl) => {
            if (this.loginForm) {
                const password = this.loginForm.get('password')?.value;
                const confirmPassword = control.value;
                return password === confirmPassword
                    ? null
                    : { passwordMismatch: true };
            }
            return null;
        };
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    togglePasswordConfirmationVisibility() {
        this.passwordConfirmationVisible = !this.passwordConfirmationVisible;
    }

    extractErrorMessage(error: any): string {
        let errorMessage = 'An error occurred';
        if (error && error.error && error.error.errors) {
            errorMessage = Object.values(error.error.errors).flat().join(', ');
        }
        return errorMessage;
    }

    login() {
        if (this.loginForm.valid) {
            this.loginService.login(this.loginForm.value).subscribe({
                next: (response: any) => {
                    const token = response.token; // Adjust based on your API response
                    this.loginService.setTokenInCookie(token);
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.errorMessage =
                        'Login failed. Please try again. ' +
                        this.extractErrorMessage(err);
                    setTimeout(() => (this.errorMessage = ''), 1000);
                },
            });
        } else {
            this.errorMessage =
                'Form is invalid. Please fill all the required fields.';
            setTimeout(() => (this.errorMessage = ''), 1000);
        }
    }
}
