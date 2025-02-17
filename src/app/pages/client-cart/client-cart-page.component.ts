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
import { ClientCartService } from './client-cart.service';

@Component({
    selector: 'app-client-cart-page',
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
    templateUrl: './client-cart-page.component.html',
    styleUrl: './client-cart-page.component.scss',
    providers: [ClientCartService],
})
export class ClientCartPageComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'client-carts/';

    constructor(
        public router: Router,
        private clientCartService: ClientCartService
    ) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.clientCartService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }
}
