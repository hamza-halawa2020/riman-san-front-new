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
    verifyForm: FormGroup;
    passwordVisible = false;
    passwordConfirmationVisible = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private forgetService: ForgetpasswordService
    ) {
        this.verifyForm = this.fb.group({
            emailOrPhone: ['', [Validators.required]],
        });
    }

    verify() {
        if (this.verifyForm.valid) {
            this.forgetService.verify(this.verifyForm.value).subscribe({
                next: (response: any) => {
                    this.successMessage = 'Please check your email';
                    setTimeout(() => {
                        this.successMessage = '';
                    }, 4000);
                },
                error: (error) => {
                    this.errorMessage =
                        error.error?.message || 'An unexpected error occurred.';
                    setTimeout(() => {
                        this.errorMessage = '';
                    }, 3000);
                },
            });
        } else {
            this.errorMessage =
                'Form is invalid. Please fill all the required fields.';
            setTimeout(() => (this.errorMessage = ''), 1000);
        }
    }
}
