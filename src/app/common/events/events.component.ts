import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { EventsService } from './events.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [
        RouterLink,
        RouterLink,
        CommonModule,
        NgIf,
        NgClass,
        HttpClientModule,
        TranslateModule
        
    ],
    templateUrl: './events.component.html',
    styleUrl: './events.component.scss',
    providers: [EventsService],
})
export class EventsComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'events/';

    constructor(public router: Router, private eventService: EventsService) {}
    ngOnInit(): void {
        this.fetchData();
    }

    fetchData() {
        this.eventService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }
}
