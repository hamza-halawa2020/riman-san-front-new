import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { EventSliderService } from './event-slider.service';

@Component({
    selector: 'app-upcoming-events',
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
    templateUrl: './upcoming-events.component.html',
    styleUrl: './upcoming-events.component.scss',
    providers: [EventSliderService],
})
export class UpcomingEventsComponent implements OnInit {
    sliderData: any;
    image = environment.imgUrl + 'events/';
    constructor(
        public router: Router,
        private eventSliderService: EventSliderService
    ) {}

    ngOnInit(): void {
        this.fetchSliderData();
    }

    fetchSliderData() {
        this.eventSliderService.index().subscribe({
            next: (response) => {
                this.sliderData = Object.values(response)[0];
            },
            error: (error) => {
            },
        });
    }

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
}
