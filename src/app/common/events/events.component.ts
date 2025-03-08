import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { EventsService } from './events.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-events',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        NgIf,
        NgClass,
        HttpClientModule,
        TranslateModule,
    ],
    templateUrl: './events.component.html',
    styleUrl: './events.component.scss',
    providers: [EventsService],
})
export class EventsComponent implements OnInit {
    data: any[] = []; // Explicitly typed as an array
    image = environment.imgUrl + 'events/';
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        public router: Router,
        private eventService: EventsService,
        public translateService: TranslateService // Injected TranslateService
    ) {}

    ngOnInit(): void {
        this.fetchData();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    fetchData() {
        this.eventService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0] as any[];
                this.translateData();
            },
            error: (error) => {
                this.errorMessage =
                    this.translateService.instant('UNEXPECTED_ERROR');
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    translateData() {
        if (!this.data || !Array.isArray(this.data)) return;

        this.data.forEach((event: any) => {
            event.translatedTitle =
                this.translateService.instant(event.title) || event.title;
        });
    }
}
