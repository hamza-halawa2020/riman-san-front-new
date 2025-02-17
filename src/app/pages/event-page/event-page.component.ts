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
import { formatDistanceToNow } from 'date-fns';
import { EventService } from './event.service';
import { EventsComponent } from '../../common/events/events.component';

@Component({
    selector: 'app-event-page',
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
        EventsComponent,
    ],
    templateUrl: './event-page.component.html',
    styleUrl: './event-page.component.scss',
    providers: [EventService],
})
export class EventPageComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'events/';

    constructor(public router: Router, private eventService: EventService) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.eventService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }
}
