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
import { ForgetpasswordService } from './forgetpassword.service';

@Component({
    selector: 'app-forgetpassword-page',
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
    templateUrl: './forgetpassword-page.component.html',
    styleUrls: ['./forgetpassword-page.component.scss'],
    providers: [ForgetpasswordService],
})
export class ForgetpasswordPageComponent {
    loginForm: FormGroup;
    passwordVisible = false;
    passwordConfirmationVisible = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private loginService: ForgetpasswordService
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
}
