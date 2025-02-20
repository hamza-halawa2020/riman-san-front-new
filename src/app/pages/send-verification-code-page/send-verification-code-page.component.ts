import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { VerifyService } from './verification.service';

@Component({
    selector: 'app-send-verification-code-page',
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
    templateUrl: './send-verification-code-page.component.html',
    styleUrls: ['./send-verification-code-page.component.scss'],
    providers: [VerifyService],
})
export class SendVerificationCodePageComponent {
    verifyForm: FormGroup;
    passwordVisible = false;
    passwordConfirmationVisible = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private verifyService: VerifyService
    ) {
        this.verifyForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    verify() {
        if (this.verifyForm.valid) {
            this.verifyService.verify(this.verifyForm.value).subscribe({
                next: (response: any) => {
                    this.successMessage = 'Your code has been sent';
                    setTimeout(() => {
                        this.successMessage = '';
                    }, 3000);
                    this.router.navigate(['/verify']);
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
