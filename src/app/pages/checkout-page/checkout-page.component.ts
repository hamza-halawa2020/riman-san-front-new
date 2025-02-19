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
import { formatDistanceToNow } from 'date-fns';
import { CheckoutService } from './checkout.service';

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

    constructor(
        public router: Router,
        private checkoutService: CheckoutService
    ) {}

    ngOnInit(): void {
        this.fetchAllProducts();

        const storedData = localStorage.getItem('checkoutData');
        if (storedData) {
            try {
                this.checkoutData = JSON.parse(storedData);
            } catch (error) {
                console.error('Error parsing checkoutData:', error);
            }
        } else {
            console.error('No checkoutData found in localStorage.');
        }

        const storedData2 = localStorage.getItem('totalPriceData');
        if (storedData2) {
            try {
                this.totalPriceData = JSON.parse(storedData2);
            } catch (error) {
                console.error('Error parsing totalPriceData:', error);
            }
        } else {
            console.error('No totalPriceData found in localStorage.');
        }
    }

    fetchAllProducts() {
        this.checkoutService.allProducts().subscribe({
            next: (response) => {
                this.products = Object.values(response)[0];
                console.log(this.products);
            },
            error: (error) => {},
        });
    }

    getProductDetails(productId: number): { title: string; image: string } {
        const product = this.products?.find((p: any) => p.id === productId);
        return product
            ? { title: product.title, image: product.productImages[0].image }
            : { title: 'Unknown', image: this.image };
    }
}
