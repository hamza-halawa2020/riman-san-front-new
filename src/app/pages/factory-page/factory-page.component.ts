import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FactoryService } from './factory.service';

@Component({
    selector: 'app-factory-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgClass,
        NgIf,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        HttpClientModule,
    ],
    templateUrl: './factory-page.component.html',
    styleUrls: ['./factory-page.component.scss'],
    providers: [FactoryService],
})
export class FactoryPageComponent implements OnInit {
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private factoryService: FactoryService) {}

    ngOnInit(): void {
        this.startCountdown();
    }

    startCountdown(): void {
        const launchDate = new Date('2025-12-31T00:00:00').getTime(); // Set your launch date
        const countdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days')!.innerText = days
                .toString()
                .padStart(2, '0');
            document.getElementById('hours')!.innerText = hours
                .toString()
                .padStart(2, '0');
            document.getElementById('minutes')!.innerText = minutes
                .toString()
                .padStart(2, '0');
            document.getElementById('seconds')!.innerText = seconds
                .toString()
                .padStart(2, '0');

            if (distance < 0) {
                clearInterval(countdown);
                document.querySelector('.countdown')!.innerHTML =
                    '<h3>Launched!</h3>';
            }
        }, 1000);
    }
}
