import { RatingModule } from 'ngx-bootstrap/rating';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { CartService } from '../cart-page/cart.service';
import { FavouriteService } from '../favourite-page/favourite.service';
import { ClientCartService } from '../client-cart/client-cart.service';
import { FavouriteClientService } from '../favourite-client-page/favourite-client.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

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
        TranslateModule,
        CarouselModule, // Add CarouselModule
    ],
    templateUrl: './product-details-page.component.html',
    styleUrls: ['./product-details-page.component.scss'],
})
export class ProductDetailsPageComponent implements OnInit, OnDestroy {
    activeTab: string = 'overview';
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
    modalSelectedImage: string = '';
    modalCurrentIndex: number = 0;
    peopleViewing: number = 22;
    private viewingInterval: any;
    private autoSlideInterval: any;

    // Related products carousel options
    relatedProductsOptions: OwlOptions;
    relatedProductsOptionsAr: OwlOptions = {
        nav: true,
        loop: true,
        margin: 25,
        dots: false,
        autoplay: true,
        smartSpeed: 500,
        rtl: true,
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
                items: 3,
            },
            1115: {
                items: 3,
            },
        },
    };
    relatedProductsOptionsEn: OwlOptions = {
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
                items: 3,
            },
            1115: {
                items: 3,
            },
        },
    };

    // Zoom effect properties
    showZoom: boolean = false;
    zoomPosition: { x: number; y: number } = { x: 0, y: 0 };
    zoomBackgroundPosition: string = '0px 0px';

    productUrl: string = '';

    constructor(
        private activateRoute: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private favouriteService: FavouriteService,
        private favClientService: FavouriteClientService,
        private cartClientService: ClientCartService,
        private loginService: LoginService,
        private cdr: ChangeDetectorRef,
        public translateService: TranslateService
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
        this.relatedProductsOptions =
            this.translateService.currentLang === 'ar'
                ? this.relatedProductsOptionsAr
                : this.relatedProductsOptionsEn;
    }

    ngOnInit(): void {
        this.getDetails();
        this.translateService.onLangChange.subscribe((event) => {
            this.relatedProductsOptions =
                event.lang === 'ar'
                    ? this.relatedProductsOptionsAr
                    : this.relatedProductsOptionsEn;
            this.translateData();
        });
        this.startViewingUpdate();
        this.startAutoSlide();
        this.productUrl = window.location.href;
    }

    ngOnDestroy(): void {
        if (this.viewingInterval) clearTimeout(this.viewingInterval);
        if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
    }

    startViewingUpdate(): void {
        // Define a function to update the number of people viewing and schedule the next update
        const updateViewing = () => {
            // Generate a random number between 30 and 49 (Math.random() * 20 generates 0-19, then add 30)
            this.peopleViewing = Math.floor(Math.random() * 20) + 30;

            // Generate a random interval between 50,000 and 59,999 milliseconds (50 to ~60 seconds)
            const randomInterval = Math.floor(Math.random() * 10000) + 50000;

            // Schedule the next update using setTimeout with the random interval
            this.viewingInterval = setTimeout(updateViewing, randomInterval);
        };

        // Start the first update immediately
        updateViewing();
    }

    startAutoSlide(): void {
        this.autoSlideInterval = setInterval(() => {
            this.nextImage();
        }, 5000);
    }

    stopAutoSlide(): void {
        if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
    }

    restartAutoSlide(): void {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.productService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
                // console.log('Details:', this.details);
                // console.log('Related Products:', this.details?.relatedProducts);
                // console.log(
                //     'Related Products Full Structure:',
                //     JSON.stringify(this.details?.relatedProducts, null, 2)
                // );
                this.translateData();
                if (this.details?.productImages?.length > 0) {
                    this.selectedImage =
                        this.image + this.details.productImages[0].image;
                    this.modalSelectedImage = this.selectedImage;
                }
                this.cdr.detectChanges();
            });
        });
    }

    translateData(): void {
        if (!this.details) return;
        this.details.translatedName =
            this.translateService.instant(this.details.title) ||
            this.details.title;
        this.details.translatedDescription =
            this.translateService.instant(this.details.description) ||
            this.details.description;

        if (this.details.relatedProducts) {
            this.details.relatedProducts.forEach((product: any) => {
                product.translatedName =
                    this.translateService.instant(product.title) ||
                    product.title;
            });
        }
        this.cdr.detectChanges();
    }

    selectImage(imageUrl: string, index: number): void {
        this.selectedImage = imageUrl;
        this.currentIndex = index;
        this.stopAutoSlide();
        setTimeout(() => this.restartAutoSlide(), 10000);
    }

    prevImage(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.selectedImage =
                this.image +
                this.details.productImages[this.currentIndex].image;
            this.stopAutoSlide();
            setTimeout(() => this.restartAutoSlide(), 10000);
        }
    }

    nextImage(): void {
        if (this.currentIndex < this.details?.productImages.length - 1) {
            this.currentIndex++;
            this.selectedImage =
                this.image +
                this.details.productImages[this.currentIndex].image;
        } else {
            this.currentIndex = 0;
            this.selectedImage =
                this.image +
                this.details.productImages[this.currentIndex].image;
        }
    }

    prevModalImage(): void {
        if (this.modalCurrentIndex > 0) {
            this.modalCurrentIndex--;
            this.modalSelectedImage =
                this.image +
                this.details.productImages[this.modalCurrentIndex].image;
        }
    }

    nextModalImage(): void {
        if (this.modalCurrentIndex < this.details?.productImages.length - 1) {
            this.modalCurrentIndex++;
            this.modalSelectedImage =
                this.image +
                this.details.productImages[this.modalCurrentIndex].image;
        }
    }

    openModal(): void {
        this.modalSelectedImage = this.selectedImage;
        this.modalCurrentIndex = this.currentIndex;
        let modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    }

    onMouseMove(event: MouseEvent): void {
        const img = event.target as HTMLImageElement;
        const rect = img.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            this.showZoom = true;

            const lensSize = 150;
            const zoomLevel = 3;

            let lensX = x - lensSize / 2;
            let lensY = y - lensSize / 2;

            lensX = Math.max(0, Math.min(lensX, rect.width - lensSize));
            lensY = Math.max(0, Math.min(lensY, rect.height - lensSize));

            this.zoomPosition = { x: lensX, y: lensY };

            const zoomX = (x / rect.width) * 100;
            const zoomY = (y / rect.height) * 100;

            this.zoomBackgroundPosition = `${zoomX}% ${zoomY}%`;
        } else {
            this.showZoom = false;
        }
    }

    onMouseLeave(): void {
        this.showZoom = false;
    }

    shareOnFacebook(): void {
        const url = encodeURIComponent(this.productUrl);
        const title = encodeURIComponent(
            this.details?.translatedName ||
                this.details?.title ||
                'Check out this product!'
        );
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}`,
            '_blank'
        );
    }

    shareOnTwitter(): void {
        const url = encodeURIComponent(this.productUrl);
        const text = encodeURIComponent(
            `Check out this product: ${
                this.details?.translatedName || this.details?.title || ''
            }`
        );
        window.open(
            `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            '_blank'
        );
    }

    shareOnWhatsApp(): void {
        const url = encodeURIComponent(this.productUrl);
        const text = encodeURIComponent(
            `Check out this product: ${
                this.details?.translatedName || this.details?.title || ''
            } - ${this.details?.translatedDescription || ''}`
        );
        window.open(
            `https://api.whatsapp.com/send?text=${text}%20${url}`,
            '_blank'
        );
    }

    addToClientCart(product: any): void {
        const client_cart = this.cartClientService.cartSubject.value;

        if (!client_cart || !Array.isArray(client_cart)) {
            this.errorMessage =
                this.translateService.instant('UNEXPECTED_ERROR');
            return;
        }

        const exists = client_cart.some(
            (item) => item && item.product_id === product.id
        );

        if (exists) {
            this.errorMessage = this.translateService.instant(
                'Product is already in the cart.'
            );
            setTimeout(() => (this.errorMessage = ''), 1000);
        } else {
            const productToAdd = { ...product, quantity: 1 };
            this.cartClientService.addToClientCart(productToAdd);
            this.successMessage = this.translateService.instant(
                'Product added to cart successfully!'
            );
            setTimeout(() => (this.successMessage = ''), 1000);
        }
    }

    addToCart(product_id: any): void {
        const payload = { product_id };
        this.cartService.addToCart(payload).subscribe({
            next: (response) => {
                this.successMessage = this.translateService.instant(
                    'Product added to cart successfully!'
                );
                setTimeout(() => (this.successMessage = ''), 1000);
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
                setTimeout(() => (this.errorMessage = ''), 3000);
            },
        });
    }

    addToFavourite(product_id: any): void {
        const payload = { product_id };
        this.favouriteService.add(payload).subscribe({
            next: (response) => {
                this.successMessage = this.translateService.instant(
                    'Product added to WishList successfully!'
                );
                setTimeout(() => (this.successMessage = ''), 1000);
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
                setTimeout(() => (this.errorMessage = ''), 3000);
            },
        });
    }

    addReview(reviewText: string, rating: number): void {
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
    ): void {
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

    addToClientFavourite(product: any): void {
        const client_fav = this.favClientService.favSubject.value;

        if (!client_fav || !Array.isArray(client_fav)) {
            this.errorMessage =
                this.translateService.instant('UNEXPECTED_ERROR');
            return;
        }

        const exists = client_fav.some(
            (item) => item && item.product_id === product.id
        );

        if (exists) {
            this.errorMessage = this.translateService.instant(
                'Product is already in the fav!'
            );
            setTimeout(() => (this.errorMessage = ''), 1000);
        } else {
            const productToAdd = { ...product, quantity: 1 };
            this.favClientService.addToClientFav(productToAdd);
            this.successMessage = this.translateService.instant(
                'Product added to fav successfully!'
            );
            setTimeout(() => (this.successMessage = ''), 1000);
        }
    }

    onImageLoad(imageUrl: string): void {
        // console.log('Image loaded:', imageUrl);
    }

    onImageError(event: Event): void {
        console.error(
            'Image failed to load:',
            (event.target as HTMLImageElement).src
        );
        (event.target as HTMLImageElement).src =
            this.image + 'fallback-image.jpg';
    }
}
