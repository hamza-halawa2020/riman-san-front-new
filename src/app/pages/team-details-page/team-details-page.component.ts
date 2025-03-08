import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { InstructorService } from './instructor.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { TruncateDescriptionPipe } from '../../truncate-description.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-team-details-page',
    standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        CommonModule,
        NgIf,
        NgClass,
        FooterComponent,
        BackToTopComponent,
        TruncateDescriptionPipe,
        TranslateModule, // Added TranslateModule
    ],
    templateUrl: './team-details-page.component.html',
    styleUrl: './team-details-page.component.scss',
})
export class TeamDetailsPageComponent implements OnInit {
    details: any;
    data: any;
    id: any;
    videoUrlSafe!: SafeResourceUrl;
    successMessage: string = '';
    errorMessage: string = '';

    image = environment.imgUrl + 'instructors/';
    courseImage = environment.imgUrl + 'Courses/';

    constructor(
        private activateRoute: ActivatedRoute,
        private instructorService: InstructorService,
        private sanitizer: DomSanitizer,
        public translateService: TranslateService // Injected TranslateService
    ) {}

    ngOnInit(): void {
        this.getDetails();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    // Video Popup
    isOpen = false;

    openPopup(videoUrl: string): void {
        this.isOpen = true;

        if (videoUrl && videoUrl.includes('youtube.com/watch')) {
            const url = new URL(videoUrl);
            const videoId = url.searchParams.get('v');

            if (videoId) {
                let safeUrl = `https://www.youtube.com/embed/${videoId}`;
                this.videoUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
            }
        }
    }

    closePopup(): void {
        this.isOpen = false;
    }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.instructorService.show(this.id).subscribe({
                next: (data) => {
                    this.details = Object.values(data)[0];
                    this.translateData();
                },
                error: (error) => {
                    this.errorMessage = this.translateService.instant('UNEXPECTED_ERROR');
                    setTimeout(() => {
                        this.errorMessage = '';
                    }, 3000);
                },
            });
        });
    }

    translateData() {
        if (!this.details) return;

        this.details.translatedName = this.translateService.instant(this.details.name) || this.details.name;
        this.details.translatedJobTitle = this.translateService.instant(this.details.job_title) || this.details.job_title;
        this.details.translatedDescription = this.translateService.instant(this.details.description) || this.details.description;

        if (this.details?.courses && Array.isArray(this.details.courses)) {
            this.details.courses.forEach((course: any) => {
                course.translatedTitle = this.translateService.instant(course.title) || course.title;
                course.translatedDescription = this.translateService.instant(course.description) || course.description;
            });
        }
    }
}