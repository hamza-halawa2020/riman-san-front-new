import { ProductSliderService } from './product-slider.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Component({
    selector: 'app-product-slider',
    standalone: true,
    imports: [
        RouterLink,
        CarouselModule,
        RouterLink,
        CommonModule,
        CarouselModule,
        NgIf,
        NgClass,
        HttpClientModule,
    ],
    templateUrl: './product-slider.component.html',
    styleUrl: './product-slider.component.scss',
    providers: [ProductSliderService],
})
export class ProductSliderComponent implements OnInit {
    sliderData: any;
    image = environment.imgUrl + 'products/';

    constructor(
        public router: Router,
        private productSliderService: ProductSliderService
    ) {}

    ngOnInit(): void {
        this.fetchSliderData();
    }

    fetchSliderData() {
        this.productSliderService.index().subscribe({
            next: (response) => {
                this.sliderData = Object.values(response)[0];
            },
            error: (error) => {
            },
        });
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
