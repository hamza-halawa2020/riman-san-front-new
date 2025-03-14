import { RatingModule } from 'ngx-bootstrap/rating';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { LoginService } from '../login-page/login.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../cart-page/cart.service';
import { FavouriteService } from '../favourite-page/favourite.service';
import { ClientCartService } from '../client-cart/client-cart.service';
import { FavouriteClientService } from '../favourite-client-page/favourite-client.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

declare var bootstrap: any;

@Component({
    selector: 'app-product-details-page',
    standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        ContactComponent,
        FooterComponent,
        BackToTopComponent,
        HttpClientModule,
        CommonModule,
        NgIf,
        NgClass,
        RatingModule,
        FormsModule,
        CarouselModule,
        TranslateModule,
    ],
    templateUrl: './product-details-page.component.html',
    styleUrls: ['./product-details-page.component.scss'],
})
export class ProductDetailsPageComponent implements OnInit {
    activeTab: string = 'overview'; // Default active tab

    switchTab(tab: string) {
        this.activeTab = tab;
    }

    name: string = '';
    email: string = '';
    phone: string = '';
    newReview: string = '';
    newRate: number = 0;
    details: any;
    data: any;
    isLoggedIn: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';
    id: any;
    image = environment.imgUrl + 'products/';
    instructorImage = environment.imgUrl + 'instructors/';
    socialImage = environment.imgUrl + 'socials/';
    selectedImage: string = '';
    currentIndex: number = 0;
    currentOptions: OwlOptions;

    constructor(
        private activateRoute: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private favouriteService: FavouriteService,
        private favClientService: FavouriteClientService,
        private cartClientService: ClientCartService,
        private loginService: LoginService,
        public translateService: TranslateService
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
        this.currentOptions =
            this.translateService.currentLang === 'ar'
                ? this.ProductSliderSlides2
                : this.ProductSliderSlides;
        this.translateService.onLangChange.subscribe((event) => {
            this.currentOptions =
                event.lang === 'ar'
                    ? this.ProductSliderSlides2
                    : this.ProductSliderSlides;
        });
    }

    ngOnInit(): void {
        this.getDetails();

        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.productService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
                this.translateData();
            });
        });
    }

    translateData() {
        if (!this.details) return;
        this.details.translatedName =
            this.translateService.instant(this.details.title) ||
            this.details.title;

        this.details.translatedDescription =
            this.translateService.instant(this.details.description) ||
            this.details.description;

        // Translate related products
        if (this.details.relatedProducts) {
            this.details.relatedProducts.forEach((product: any) => {
                product.translatedName =
                    this.translateService.instant(product.title) ||
                    product.title;
            });
        }
    }

    addToClientCart(product: any) {
        const client_cart = this.cartClientService.cartSubject.value;

        if (!client_cart || !Array.isArray(client_cart)) {
            this.errorMessage = this.translateService.instant(
                'UNEXPECTED_ERROR'
            );
            return;
        }

        const exists = client_cart.some(
            (item) => item && item.product_id === product.id
        );

        if (exists) {
            this.errorMessage = this.translateService.instant(
                'Product is already in the cart.'
            );
            setTimeout(() => {
                this.errorMessage = '';
            }, 1000);
        } else {
            const productToAdd = { ...product, quantity: 1 };
            this.cartClientService.addToClientCart(productToAdd);

            this.successMessage = this.translateService.instant(
                'Product added to cart successfully!'
            );
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
                this.successMessage = this.translateService.instant(
                    'Product added to cart successfully!'
                );
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
                this.successMessage = this.translateService.instant(
                    'Product added to WishList successfully!'
                );
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

    openModal(imageUrl: string, index: number) {
        this.selectedImage = imageUrl;
        this.currentIndex = index;
        let modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    }

    nextImage() {
        if (this.currentIndex < this.details.productImages.length - 1) {
            this.currentIndex++;
            this.selectedImage =
                this.image +
                this.details.productImages[this.currentIndex].image;
        }
    }

    prevImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.selectedImage =
                this.image +
                this.details.productImages[this.currentIndex].image;
        }
    }

    addReview(reviewText: string, rating: number) {
        if (!reviewText || reviewText.trim() === '') {
            this.errorMessage = this.translateService.instant(
                'Review cannot be empty!'
            );
            setTimeout(() => (this.errorMessage = ''), 1000);
            return;
        }

        const reviewData = {
            product_id: this.id,
            review: reviewText,
            rating: rating || 0,
        };

        this.productService.addReview(reviewData).subscribe({
            next: (response) => {
                this.getDetails();
                this.details.productReviews.unshift(response);
                this.successMessage = this.translateService.instant(
                    'Review added successfully but it is under review!'
                );
                setTimeout(() => (this.successMessage = ''), 3000);

                this.newReview = '';
                this.newRate = 0;
            },
            error: (error) => {
                this.errorMessage =
                    error.error?.message ||
                    this.translateService.instant('UNEXPECTED_ERROR');
                setTimeout(() => (this.errorMessage = ''), 1000);
            },
        });
    }

    addClientReview(
        reviewText: string,
        rating: number,
        nameText: string,
        emailText: string,
        phoneText: string
    ) {
        if (!reviewText || reviewText.trim() === '') {
            this.errorMessage = this.translateService.instant(
                'Review cannot be empty!'
            );
            setTimeout(() => (this.errorMessage = ''), 1000);
            return;
        }

        const reviewData = {
            product_id: this.id,
            review: reviewText,
            rating: rating || 0,
            name: nameText,
            email: emailText,
            phone: phoneText,
        };

        this.productService.addClientReview(reviewData).subscribe({
            next: (response) => {
                this.getDetails();
                this.details.productReviews.unshift(response);
                this.successMessage = this.translateService.instant(
                    'Review added successfully but it is under review!'
                );
                setTimeout(() => (this.successMessage = ''), 3000);

                this.newReview = '';
                this.newRate = 0;
            },
            error: (error) => {
                this.errorMessage =
                    error.error?.message ||
                    this.translateService.instant('UNEXPECTED_ERROR');
                setTimeout(() => (this.errorMessage = ''), 1000);
            },
        });
    }

    addToClientFavourite(product: any) {
        const client_fav = this.favClientService.favSubject.value;

        if (!client_fav || !Array.isArray(client_fav)) {
            this.errorMessage = this.translateService.instant(
                'UNEXPECTED_ERROR'
            );
            return;
        }

        const exists = client_fav.some(
            (item) => item && item.product_id === product.id
        );

        if (exists) {
            this.errorMessage = this.translateService.instant(
                'Product is already in the fav!'
            );
            setTimeout(() => {
                this.errorMessage = '';
            }, 1000);
        } else {
            const productToAdd = { ...product, quantity: 1 };
            this.favClientService.addToClientFav(productToAdd);

            this.successMessage = this.translateService.instant(
                'Product added to fav successfully!'
            );
            setTimeout(() => {
                this.successMessage = '';
            }, 1000);
        }
    }

    ProductSliderSlides: OwlOptions = {
        nav: true,
        loop: true,
        margin: 25,
        dots: false,
        autoplay: true,
        smartSpeed: 500,
        autoplayHoverPause: true,
        navText: [
            "<i class='fa-solid fa-chevron-left'></i>",
            "<i class='fa-solid fa-chevron-right'></i>",
        ],
        responsive: {
            0: {
                items: 1,
            },
            515: {
                items: 1,
            },
            695: {
                items: 2,
            },
            935: {
                items: 2,
            },
            1115: {
                items: 2,
            },
        },
    };

    ProductSliderSlides2: OwlOptions = {
        nav: true,
        loop: true,
        margin: 25,
        dots: false,
        rtl: true,
        autoplay: true,
        smartSpeed: 500,
        autoplayHoverPause: true,
        navText: [
            "<i class='fa-solid fa-chevron-left'></i>",
            "<i class='fa-solid fa-chevron-right'></i>",
        ],
        responsive: {
            0: {
                items: 1,
            },
            515: {
                items: 1,
            },
            695: {
                items: 2,
            },
            935: {
                items: 2,
            },
            1115: {
                items: 2,
            },
        },
    };
}