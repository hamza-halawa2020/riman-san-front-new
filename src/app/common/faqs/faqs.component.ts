import { RouterLink, Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FaqsService } from './faqs.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-faqs',
    standalone: true,
    imports: [
        RouterLink,
        CarouselModule,
        RouterLink,
        CommonModule,
        CarouselModule,
        NgIf,
        NgClass,
        NgbModule,
        HttpClientModule,
    ],
    templateUrl: './faqs.component.html',
    styleUrl: './faqs.component.scss',
    providers: [FaqsService],
})
export class FaqsComponent implements OnInit {
    data: any;

    constructor(private faqsService: FaqsService) {}

    ngOnInit(): void {
        this.fetchSliderData();
    }

    fetchSliderData() {
        this.faqsService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }
}
