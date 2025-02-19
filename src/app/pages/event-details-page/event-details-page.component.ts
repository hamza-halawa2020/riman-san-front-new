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
import { FormsModule } from '@angular/forms';
import { EventService } from './event.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
declare var bootstrap: any;
@Component({
    selector: 'app-event-details-page',
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
        RatingModule,
        FormsModule,
        CarouselModule,
    ],
    templateUrl: './event-details-page.component.html',
    styleUrl: './event-details-page.component.scss',
})
export class EventDetailsPageComponent implements OnInit {
    activeTab: string = 'overview'; // Default active tab

    switchTab(tab: string) {
        this.activeTab = tab;
    }
    details: any;
    data: any;
    selectedImage: string = '';
    currentIndex: number = 0;
    id: any;
    image = environment.imgUrl + 'events/';
    eventImage = environment.imgUrl + 'events/';
    socialImage = environment.imgUrl + 'socials/';
    constructor(
        private activateRoute: ActivatedRoute,
        private eventService: EventService
    ) {}

    ngOnInit(): void {
        this.getDetails();
        this.fetchdata();
    }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.eventService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
            });
        });
    }
    fetchdata() {
        this.eventService.allSocial().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }

    openModal(imageUrl: string, index: number) {
        this.selectedImage = imageUrl;
        this.currentIndex = index;
        let modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    }
    nextImage() {
        if (this.currentIndex < this.details.eventImages.length - 1) {
            this.currentIndex++;
            this.selectedImage =
                this.image +
                this.details.eventImages[this.currentIndex].image;
        }
    }

    prevImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.selectedImage =
                this.image +
                this.details.eventImages[this.currentIndex].image;
        }
    }

    eventSliderSlides: OwlOptions = {
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
