import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MainSliderService } from './main-slider.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-main-slider',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        CarouselModule,
        NgIf,
        NgClass,
        HttpClientModule,
    ],
    templateUrl: './main-slider.component.html',
    styleUrl: './main-slider.component.scss',
    providers: [MainSliderService],
})
export class MainSlider implements OnInit {
    sliderData: any;
    image = environment.imgUrl + 'main-sliders/';
    currentOptions: OwlOptions;
    feedbackSlides: OwlOptions = {
        items: 1,
        nav: false,
        loop: true,
        margin: 25,
        dots: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoHeight: false,
        responsive: {
            0: {
                autoHeight: false,
            },
        },
        navText: [
            "<i class='fa-solid fa-chevron-left'></i>",
            "<i class='fa-solid fa-chevron-right'></i>",
        ],
    };

    feedbackSlides2: OwlOptions = {
        items: 1,
        nav: false,
        loop: true,
        margin: 25,
        dots: true,
        autoplay: true,
        autoplayHoverPause: true,
        rtl: true,
        autoHeight: false,
        responsive: {
            0: {
                autoHeight: false,
            },
        },
        navText: [
            "<i class='fa-solid fa-arrow-right'></i>",
            "<i class='fa-solid fa-arrow-left'></i>",
        ],
    };

    constructor(
        public router: Router,
        private mainSliderService: MainSliderService,
        private translate: TranslateService
    ) {
        this.currentOptions =
            this.translate.currentLang === 'ar'
                ? this.feedbackSlides2
                : this.feedbackSlides;
        this.translate.onLangChange.subscribe((event) => {
            this.currentOptions =
                event.lang === 'ar'
                    ? this.feedbackSlides2
                    : this.feedbackSlides;
        });
    }

    ngOnInit(): void {
        this.fetchSliderData();
    }

    fetchSliderData() {
        this.mainSliderService.index().subscribe({
            next: (response) => {
                this.sliderData = Object.values(response)[0];
            },
        });
    }
}
