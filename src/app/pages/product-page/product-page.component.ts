import { LoginService } from './../login-page/login.service';
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
    ],
    templateUrl: './product-page.component.html',
    styleUrl: './product-page.component.scss',
    providers: [ProductService],
})
export class ProductPageComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'products/';
    isLoggedIn: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        public router: Router,
        private productService: ProductService,
        private cartService: CartService,
        private loginService: LoginService
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
    }

    ngOnInit(): void {
        this.fetchdata();
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

    fetchdata() {
        this.productService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }
}
