import { RatingModule } from 'ngx-bootstrap/rating';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
    ],

    templateUrl: './product-details-page.component.html',
    styleUrl: './product-details-page.component.scss',
})
export class ProductDetailsPageComponent implements OnInit {
    activeTab: string = 'overview'; // Default active tab

    switchTab(tab: string) {
        this.activeTab = tab;
    }
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
    constructor(
        private activateRoute: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private loginService: LoginService
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
    }

    ngOnInit(): void {
        this.getDetails();
    }

    addToCart(product_id: any) {
        const payload = {
            product_id: product_id,
        };

        this.cartService.addToCart(payload).subscribe({
            next: (response) => {
                this.successMessage = 'Product added to cart successfully!';
                setTimeout(() => {
                    this.successMessage = '';
                }, 1000);
                this.cartService.notifyCartUpdate();
            },
            error: (error) => {
                this.errorMessage =
                    error.error?.message || 'An unexpected error occurred.';
                setTimeout(() => {
                    this.errorMessage = '';
                }, 1000);
            },
        });
    }

    openModal(imageUrl: string, index: number) {
        this.selectedImage = imageUrl;
        this.currentIndex = index;
        let modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    }
    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.productService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
            });
        });
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
}
