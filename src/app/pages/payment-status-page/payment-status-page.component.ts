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
        private cartService: CartService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.success = params['success'] === 'true';
            this.message = params['message'] || 'No message available';

            if (this.success) {
                localStorage.removeItem('checkoutData');
                localStorage.removeItem('totalPriceData');
                localStorage.removeItem('appliedCoupon');
                this.checkoutService.clearCart().subscribe({
                    next: () => {
                        this.cartService.notifyCartUpdate();
                    },
                });
            }
        });

        setTimeout(() => {
            this.router.navigate(['/profile']);
        }, 5000);
    }
}
