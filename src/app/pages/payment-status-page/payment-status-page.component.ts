import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart-page/cart.service';
import { CheckoutService } from '../checkout-page/checkout.service';
import { ClientCartService } from '../client-cart/client-cart.service';
import { TranslateService,TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-payment-status-page',
    standalone: true,
    imports: [
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        NgClass,
        NgIf,
        NgbModule,
        CommonModule,
        TranslateModule, // Added for translations
    ],
    templateUrl: './payment-status-page.component.html',
    styleUrl: './payment-status-page.component.scss',
})
export class PaymentStatusPageComponent implements OnInit {
    success: boolean = false;
    message: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private checkoutService: CheckoutService,
        private cartClientService: ClientCartService,
        private cartService: CartService,
        public translateService: TranslateService // Injected for translation
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.success = params['success'] === 'true';
            this.message =
                params['message'] ||
                this.translateService.instant('NO_MESSAGE_AVAILABLE');

            if (this.success) {
                localStorage.removeItem('checkoutData');
                localStorage.removeItem('totalPriceData');
                localStorage.removeItem('appliedCoupon');
                this.cartService.clearCart().subscribe({
                    next: () => {},
                    error: (error) => this.handleError(error),
                });
                this.cartClientService.clearCart();
            }
        });

        setTimeout(() => {
            this.router.navigate(['/products']);
        }, 5000);
    }

    private handleError(error: any) {
        this.message =
            error.error?.message ||
            this.translateService.instant('UNEXPECTED_ERROR');
        this.success = false;
        setTimeout(() => {
            this.router.navigate(['/products']);
        }, 5000);
    }
}
