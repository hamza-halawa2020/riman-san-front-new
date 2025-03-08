import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { InstructorService } from './instructor.service';
import { Router } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-team-page',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        HttpClientModule,
        CommonModule,
        NgIf,
        NgClass,
        TranslateModule, // Added TranslateModule
    ],
    templateUrl: './team-page.component.html',
    styleUrl: './team-page.component.scss',
    providers: [InstructorService],
})
export class TeamPageComponent implements OnInit {
    data: any[] = []; // Explicitly typed as an array
    image = environment.imgUrl + 'instructors/';
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        public router: Router,
        private instructorService: InstructorService,
        public translateService: TranslateService // Injected TranslateService
    ) {}

    ngOnInit(): void {
        this.fetchdata();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    fetchdata() {
        this.instructorService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0] as any[];
                this.translateData();
            },
            error: (error) => {
                this.errorMessage = this.translateService.instant('UNEXPECTED_ERROR');
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    translateData() {
        if (!this.data || !Array.isArray(this.data)) return;

        this.data.forEach((instructor: any) => {
            instructor.translatedName = this.translateService.instant(instructor.name) || instructor.name;
            instructor.translatedJobTitle = this.translateService.instant(instructor.job_title) || instructor.job_title;
        });
    }
}