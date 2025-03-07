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
import { ProductService } from './product.service';
import { CartService } from '../cart-page/cart.service';
import { FavouriteService } from '../favourite-page/favourite.service';
import { ClientCartService } from '../client-cart/client-cart.service';
import { FavouriteClientService } from '../favourite-client-page/favourite-client.service';
import { LoginService } from '../login-page/login.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-product-page',
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
        TranslateModule, // Added TranslateModule
    ],
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.scss'],
    providers: [ProductService],
})
export class ProductPageComponent implements OnInit {
    data: any[] = []; // Explicitly typed as an array
    image = environment.imgUrl + 'products/';
    isLoggedIn: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        public router: Router, // Made public
        private productService: ProductService,
        private cartService: CartService,
        private cartClientService: ClientCartService,
        private favouriteService: FavouriteService,
        private favClientService: FavouriteClientService,
        private loginService: LoginService,
        public translateService: TranslateService // Made public
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
    }

    ngOnInit(): void {
        this.fetchdata();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    addToClientCart(product: any) {
        const client_cart = this.cartClientService.cartSubject.value;

        if (!client_cart || !Array.isArray(client_cart)) {
            this.errorMessage = this.translateService.instant('CART_DATA_NOT_AVAILABLE');
            return;
        }

        const exists = client_cart.some(
            (item) => item && item.product_id === product.id
        );

        if (exists) {
            this.errorMessage = this.translateService.instant('PRODUCT_ALREADY_IN_CART');
            setTimeout(() => {
                this.errorMessage = '';
            }, 1000);
        } else {
            const productToAdd = { ...product, quantity: 1 };
            this.cartClientService.addToClientCart(productToAdd);

            this.successMessage = this.translateService.instant('PRODUCT_ADDED_TO_CART');
            setTimeout(() => {
                this.successMessage = '';
            }, 1000);
        }
    }

    addToCart(product_id: any) {
        const payload = {
            product_id: product_id,
        };

        this.cartService.addToCart(payload).subscribe({
            next: (response) => {
                this.successMessage = this.translateService.instant('PRODUCT_ADDED_TO_CART');
                setTimeout(() => {
                    this.successMessage = '';
                }, 1000);
            },
            error: (error) => {
                if (error.error?.errors) {
                    this.errorMessage = Object.values(error.error.errors)
                        .flat()
                        .join(' | ');
                } else {
                    this.errorMessage =
                        error.error?.message ||
                        this.translateService.instant('UNEXPECTED_ERROR');
                }
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    addToFavourite(product_id: any) {
        const payload = {
            product_id: product_id,
        };

        this.favouriteService.add(payload).subscribe({
            next: (response) => {
                this.successMessage = this.translateService.instant('PRODUCT_ADDED_TO_WISHLIST');
                setTimeout(() => {
                    this.successMessage = '';
                }, 1000);
            },
            error: (error) => {
                if (error.error?.errors) {
                    this.errorMessage = Object.values(error.error.errors)
                        .flat()
                        .join(' | ');
                } else {
                    this.errorMessage =
                        error.error?.message ||
                        this.translateService.instant('UNEXPECTED_ERROR');
                }
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    addToClientFavourite(product: any) {
        const client_fav = this.favClientService.favSubject.value;

        if (!client_fav || !Array.isArray(client_fav)) {
            this.errorMessage = this.translateService.instant('FAV_DATA_NOT_AVAILABLE');
            return;
        }

        const exists = client_fav.some(
            (item) => item && item.product_id === product.id
        );

        if (exists) {
            this.errorMessage = this.translateService.instant('PRODUCT_ALREADY_IN_FAV');
            setTimeout(() => {
                this.errorMessage = '';
            }, 1000);
        } else {
            const productToAdd = { ...product, quantity: 1 };
            this.favClientService.addToClientFav(productToAdd);

            this.successMessage = this.translateService.instant('PRODUCT_ADDED_TO_FAV');
            setTimeout(() => {
                this.successMessage = '';
            }, 1000);
        }
    }

    fetchdata() {
        this.productService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
                this.translateData();
            },
            error: (error) => {
                this.errorMessage = this.translateService.instant('UNEXPECTED_ERROR');
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    translateData() {
        if (!this.data || !Array.isArray(this.data)) return;

        this.data.forEach((product: any) => {
            product.translatedName =
                this.translateService.instant(product.title) || product.title;
            product.translatedDescription =
                this.translateService.instant(product.description) ||
                product.description;
        });
    }
}