import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { EventSliderService } from './event-slider.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-upcoming-events',
    standalone: true,
    imports: [
        RouterLink,
        CarouselModule,
        CommonModule,
        NgIf,
        NgClass,
        HttpClientModule,
        TranslateModule,
    ],
    templateUrl: './upcoming-events.component.html',
    styleUrl: './upcoming-events.component.scss',
    providers: [EventSliderService],
})
export class UpcomingEventsComponent implements OnInit {
    sliderData: any[] = []; // Explicitly typed as an array
    image = environment.imgUrl + 'events/';
    currentOptions: OwlOptions;
    successMessage: string = '';
    errorMessage: string = '';

    upcomingEventsSlides: OwlOptions = {
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

    upcomingEventsSlides2: OwlOptions = {
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
                items: 2,
            },
            1115: {
                items: 2,
            },
        },
    };

    constructor(
        public router: Router,
        private eventSliderService: EventSliderService,
        public translate: TranslateService // Injected as public for template access
    ) {
        this.currentOptions =
            this.translate.currentLang === 'ar'
                ? this.upcomingEventsSlides2
                : this.upcomingEventsSlides;
        this.translate.onLangChange.subscribe((event) => {
            this.currentOptions =
                event.lang === 'ar'
                    ? this.upcomingEventsSlides2
                    : this.upcomingEventsSlides;
            this.translateData(); // Re-translate data on language change
        });
    }

    ngOnInit(): void {
        this.fetchSliderData();
    }

    fetchSliderData() {
        this.eventSliderService.index().subscribe({
            next: (response) => {
                this.sliderData = Object.values(response)[0] as any[];
                this.translateData();
            },
            error: (error) => {
                this.errorMessage = this.translate.instant('UNEXPECTED_ERROR');
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    translateData() {
        if (!this.sliderData || !Array.isArray(this.sliderData)) return;

        this.sliderData.forEach((slide: any) => {
            slide.translatedTitle = this.translate.instant(slide.title) || slide.title;
        });
    }
}