import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FeedbackComponent } from '../../common/feedback/feedback.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { environment } from '../../../environments/environment.development';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { CheckoutService } from './checkout.service';
import { CartService } from '../cart-page/cart.service';
import { LoginService } from '../login-page/login.service';
import { ClientCartService } from '../client-cart/client-cart.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-checkout-page',
    standalone: true,
    imports: [
        HttpClientModule,
        CommonModule,
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        FeedbackComponent,
        NgIf,
        NgClass,
        FooterComponent,
        BackToTopComponent,
        TranslateModule,
    ],
    templateUrl: './checkout-page.component.html',
    styleUrl: './checkout-page.component.scss',
    providers: [CheckoutService],
})
export class CheckoutPageComponent implements OnInit {
    products: any;
    image = environment.imgUrl + 'products/';
    checkoutData: any;
    totalPriceData: any;
    successMessage: string = '';
    errorMessage: string = '';
    isLoggedIn: boolean = false;

    constructor(
        public router: Router,
        private checkoutService: CheckoutService,
        private cartService: CartService,
        private cartClientService: ClientCartService,
        private loginService: LoginService
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
    }

    ngOnInit(): void {
        this.fetchAllProducts();

        const storedData = localStorage.getItem('checkoutData');
        if (storedData) {
            this.checkoutData = JSON.parse(storedData);
        }

        const storedData2 = localStorage.getItem('totalPriceData');
        if (storedData2) {
            this.totalPriceData = JSON.parse(storedData2);
        }
    }

    fetchAllProducts() {
        this.checkoutService.allProducts().subscribe({
            next: (response) => {
                this.products = Object.values(response)[0];
            },
        });
    }

    getProductDetails(productId: number): { title: string; image: string } {
        const product = this.products?.find((p: any) => p.id === productId);
        return product
            ? { title: product.title, image: product.productImages[0].image }
            : { title: 'Unknown', image: 'default.png' };
    }

    updatePaymentMethod(method: string) {
        let storedData = localStorage.getItem('checkoutData');

        if (storedData) {
            let checkoutData = JSON.parse(storedData);
            checkoutData.payment_method = method;
            localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        }
    }

    proceedToCheckout() {
        const storedData = localStorage.getItem('checkoutData');
        if (storedData) {
            try {
                let checkoutData = JSON.parse(storedData);

                if (checkoutData.payment_method === 'cash_on_delivery') {
                    this.checkoutService.storeOrder(checkoutData).subscribe({
                        next: () => {
                            this.successMessage =
                                'Your order has been placed successfully with Cash on Delivery!';
                            setTimeout(() => {
                                this.successMessage = '';
                            }, 3000);
                            localStorage.removeItem('checkoutData');
                            localStorage.removeItem('totalPriceData');
                            localStorage.removeItem('appliedCoupon');

                            // Reset component state
                            this.checkoutData = null;
                            this.totalPriceData = null;

                            this.cartService.clearCart().subscribe({
                                next: () => {},
                            });
                        },
                        error: (error) => {
                            if (error.error?.errors) {
                                this.errorMessage = Object.values(
                                    error.error.errors
                                )
                                    .flat()
                                    .join(' | ');
                            } else {
                                this.errorMessage =
                                    error.error?.message ||
                                    'An unexpected error occurred.';
                            }
                            setTimeout(() => {
                                this.errorMessage = '';
                            }, 3000);
                        },
                    });
                } else if (checkoutData.payment_method === 'visa') {
                    this.checkoutService.storeOrder(checkoutData).subscribe({
                        next: (orderResponse: any) => {
                            const payLoad = {
                                orderID: orderResponse.data.id,
                            };

                            this.checkoutService
                                .getPaymentLink(payLoad)
                                .subscribe({
                                    next: (paymentResponse: any) => {
                                        window.open(paymentResponse.iframe_url);
                                        // window.open(
                                        //     paymentResponse.iframe_url,
                                        //     '_blank'
                                        // );
                                    },
                                    error: (error) => {
                                        this.errorMessage =
                                            error.error?.message ||
                                            'Error fetching payment link.';
                                        setTimeout(() => {
                                            this.errorMessage = '';
                                        }, 3000);
                                    },
                                });
                        },
                        error: (error) => {
                            if (error.error?.errors) {
                                this.errorMessage = Object.values(
                                    error.error.errors
                                )
                                    .flat()
                                    .join(' | ');
                            } else {
                                this.errorMessage =
                                    error.error?.message ||
                                    'An unexpected error occurred.';
                            }
                            setTimeout(() => {
                                this.errorMessage = '';
                            }, 3000);
                        },
                    });
                }
            } catch (error: any) {
                if (error.error?.errors) {
                    this.errorMessage = Object.values(error.error.errors)
                        .flat()
                        .join(' | ');
                } else {
                    this.errorMessage =
                        error.error?.message || 'An unexpected error occurred.';
                }
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            }
        } else {
            this.errorMessage = 'No checkoutData found in localStorage.';
            setTimeout(() => {
                this.errorMessage = '';
            }, 3000);
        }
    }
    proceedToClientCheckout() {
        const storedData = localStorage.getItem('checkoutData');
        if (storedData) {
            try {
                let checkoutData = JSON.parse(storedData);

                if (checkoutData.payment_method === 'cash_on_delivery') {
                    this.checkoutService
                        .storeClientOrder(checkoutData)
                        .subscribe({
                            next: () => {
                                this.successMessage =
                                    'Your order has been placed successfully with Cash on Delivery!';
                                setTimeout(() => {
                                    this.successMessage = '';
                                }, 3000);
                                localStorage.removeItem('checkoutData');
                                localStorage.removeItem('totalPriceData');
                                localStorage.removeItem('appliedCoupon');

                                // Reset component state
                                this.checkoutData = null;
                                this.totalPriceData = null;

                                this.cartClientService.clearCart();
                            },
                            error: (error) => {
                                if (error.error?.errors) {
                                    this.errorMessage = Object.values(
                                        error.error.errors
                                    )
                                        .flat()
                                        .join(' | ');
                                } else {
                                    this.errorMessage =
                                        error.error?.message ||
                                        'An unexpected error occurred.';
                                }
                                setTimeout(() => {
                                    this.errorMessage = '';
                                }, 3000);
                            },
                        });
                } else if (checkoutData.payment_method === 'visa') {
                    this.checkoutService
                        .storeClientOrder(checkoutData)
                        .subscribe({
                            next: (orderResponse: any) => {
                                const payLoad = {
                                    orderID: orderResponse.data.id,
                                };

                                this.checkoutService
                                    .getPaymentLink(payLoad)
                                    .subscribe({
                                        next: (paymentResponse: any) => {
                                            window.open(
                                                paymentResponse.iframe_url
                                            );
                                            // window.open(
                                            //     paymentResponse.iframe_url,
                                            //     '_blank'
                                            // );
                                        },
                                        error: (error) => {
                                            this.errorMessage =
                                                error.error?.message ||
                                                'Error fetching payment link.';
                                            setTimeout(() => {
                                                this.errorMessage = '';
                                            }, 3000);
                                        },
                                    });
                            },
                            error: (error) => {
                                if (error.error?.errors) {
                                    this.errorMessage = Object.values(
                                        error.error.errors
                                    )
                                        .flat()
                                        .join(' | ');
                                } else {
                                    this.errorMessage =
                                        error.error?.message ||
                                        'An unexpected error occurred.';
                                }
                                setTimeout(() => {
                                    this.errorMessage = '';
                                }, 3000);
                            },
                        });
                }
            } catch (error: any) {
                if (error.error?.errors) {
                    this.errorMessage = Object.values(error.error.errors)
                        .flat()
                        .join(' | ');
                } else {
                    this.errorMessage =
                        error.error?.message || 'An unexpected error occurred.';
                }
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            }
        } else {
            this.errorMessage = 'No checkoutData found in localStorage.';
            setTimeout(() => {
                this.errorMessage = '';
            }, 3000);
        }
    }
}
