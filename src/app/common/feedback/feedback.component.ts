import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { FeedBackService } from './feed-back.service';
import { formatDistanceToNow } from 'date-fns';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ar } from 'date-fns/locale'; // Import Arabic locale
import { enUS } from 'date-fns/locale'; // Import English locale

@Component({
    selector: 'app-feedback',
    standalone: true,
    imports: [
        RouterLink,
        CarouselModule,
        CommonModule,
        NgIf,
        NgClass,
        TranslateModule,
        HttpClientModule,
    ],
    templateUrl: './feedback.component.html',
    styleUrl: './feedback.component.scss',
    providers: [FeedBackService],
})
export class FeedbackComponent implements OnInit {
    sliderData: any[] = [];
    groupedSliderData: any[][] = []; // Grouped reviews (3 per slide)
    productImage = environment.imgUrl + 'products/';
    currentOptions: OwlOptions;
    feedbackSlides: OwlOptions = {
        items: 1, // Still 1 slide at a time, but each slide will contain 3 reviews
        nav: false,
        loop: true,
        margin: 25,
        dots: true,
        autoplay: true,
        autoplayHoverPause: true,
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
        rtl: true,
        dots: true,
        autoplay: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                autoHeight: false,
            },
        },
        navText: [
            "<i class='fa-solid fa-arrow-left'></i>",
            "<i class='fa-solid fa-arrow-right'></i>",
        ],
    };

    constructor(
        public router: Router,
        private feedBackService: FeedBackService,
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
        this.feedBackService.index().subscribe({
            next: (response) => {
                this.sliderData = Object.values(response)[0];
                this.groupSliderData(); // Group the reviews into sets of 3
            },
            error: (error) => {},
        });
    }

    // Group reviews into sets of 3 for each slide
    groupSliderData() {
        this.groupedSliderData = [];
        for (let i = 0; i < this.sliderData.length; i += 3) {
            this.groupedSliderData.push(this.sliderData.slice(i, i + 3));
        }
    }

    getStars(rating: number): boolean[] {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating);
        }
        return stars;
    }

    getRelativeTime(dateString: string): string {
        const date = new Date(dateString);
        const locale = this.translate.currentLang === 'ar' ? ar : enUS;

        return formatDistanceToNow(date, { addSuffix: true, locale }); // e.g., "2 days ago"
    }
}