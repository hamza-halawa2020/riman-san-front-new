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
import { ShopService } from './shop.service';
import { CartService } from '../cart-page/cart.service';
import { FavouriteService } from '../favourite-page/favourite.service';
import { ClientCartService } from '../client-cart/client-cart.service';
import { FavouriteClientService } from '../favourite-client-page/favourite-client.service';
import { LoginService } from '../login-page/login.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-shop-page',
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
    templateUrl: './shop-page.component.html',
    styleUrls: ['./shop-page.component.scss'],
    providers: [ShopService],
})
export class ShopPageComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'categories/';
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        public router: Router,
        private shopService: ShopService,
        public translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.fetchdata();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    fetchdata() {
        this.shopService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
                console.log('data',this.data);
                this.translateData();
            },
            error: (error) => {
                this.errorMessage =
                    this.translateService.instant('UNEXPECTED_ERROR');
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    translateData() {
        if (!this.data || !Array.isArray(this.data)) return;

        this.data.forEach((category: any) => {
            if (category.name && category.name.trim()) {
                category.translatedTitle =
                    this.translateService.instant(category.name) ||
                    category.name;
            } else {
                // console.warn('Category name is missing or empty:', category);
                category.translatedTitle = 'UNKNOWN_CATEGORY';
            }
        });
    }
}
