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
import { EventService } from './event.service';

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
        SafeUrlPipe,
        RatingModule,
        FormsModule,
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
}
