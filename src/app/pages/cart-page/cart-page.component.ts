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
import { CartService } from './cart.service';

@Component({
    selector: 'app-cart-page',
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
    templateUrl: './cart-page.component.html',
    styleUrl: './cart-page.component.scss',
    providers: [CartService],
})
export class CartPageComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'carts/';

    constructor(
        public router: Router,
        private cartService: CartService
    ) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.cartService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];                
            },
            error: (error) => {},
        });
    }
}
