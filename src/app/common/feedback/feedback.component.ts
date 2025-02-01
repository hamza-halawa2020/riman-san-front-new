import { RouterLink, Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { FeedBackService } from './feed-back.service';
import { formatDistanceToNow } from 'date-fns';

@Component({
    selector: 'app-feedback',
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
    templateUrl: './feedback.component.html',
    styleUrl: './feedback.component.scss',
    providers: [FeedBackService],
})
export class FeedbackComponent implements OnInit {
    sliderData: any;
    productImage = environment.imgUrl + 'products/';

    constructor(
        public router: Router,
        private feedBackService: FeedBackService
    ) {}

    ngOnInit(): void {
        this.fetchSliderData();
    }

    fetchSliderData() {
        this.feedBackService.index().subscribe({
            next: (response) => {
                this.sliderData = Object.values(response)[0];
            },
            error: (error) => {
            },
        });
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
		return formatDistanceToNow(date, { addSuffix: true }); // e.g., "2 days ago"
	}

    feedbackSlides: OwlOptions = {
        items: 1,
        nav: false,
        loop: true,
        margin: 25,
        dots: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
            "<i class='fa-solid fa-chevron-left'></i>",
            "<i class='fa-solid fa-chevron-right'></i>",
        ],
    };
    feedbackSlides2: OwlOptions = {
        items: 1,
        nav: true,
        loop: true,
        margin: 25,
        dots: false,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
            "<i class='fa-solid fa-arrow-left'></i>",
            "<i class='fa-solid fa-arrow-right'></i>",
        ],
    };
}
