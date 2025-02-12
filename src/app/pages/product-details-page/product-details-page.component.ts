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
import { SafeUrlPipe } from '../../safe-url.pipe';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product.service';

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
        SafeUrlPipe,
        RatingModule,
        FormsModule,
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

    id: any;
    image = environment.imgUrl + 'products/';
    instructorImage = environment.imgUrl + 'instructors/';
    socialImage = environment.imgUrl + 'socials/';
    constructor(
        private activateRoute: ActivatedRoute,
        private productService: ProductService
    ) {}

    ngOnInit(): void {
        this.getDetails();
    }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.productService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
            });
        });
    }
}
