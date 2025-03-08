import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { TruncateDescriptionPipe } from '../../truncate-description.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';
import { CourseService } from './course.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-courses-page',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        RouterLink,
        NgIf,
        NgClass,
        TruncateDescriptionPipe,
        TranslateModule, // Added TranslateModule
    ],
    templateUrl: './courses-page.component.html',
    styleUrls: ['./courses-page.component.scss'],
    providers: [CourseService],
})
export class CoursesPageComponent implements OnInit {
    data: any[] = []; // Explicitly typed as an array
    videoUrlSafe!: SafeResourceUrl;
    image = environment.imgUrl + 'Courses/';
    imageInstructor = environment.imgUrl + 'instructors/';
    isOpen = false;

    constructor(
        public router: Router,
        private coursesService: CourseService,
        private sanitizer: DomSanitizer,
        public translateService: TranslateService // Made public
    ) {}

    ngOnInit(): void {
        this.fetchData();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    openPopup(videoUrl: string): void {
        this.isOpen = true;

        if (videoUrl && videoUrl.includes('youtube.com/watch')) {
            const url = new URL(videoUrl);
            const videoId = url.searchParams.get('v');

            if (videoId) {
                let safeUrl = `https://www.youtube.com/embed/${videoId}`;
                this.videoUrlSafe =
                    this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
            }
        }
    }

    closePopup(): void {
        this.isOpen = false;
    }

    fetchData() {
        this.coursesService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0] as any[];
                this.translateData();
            },
            error: (error) => {
                console.error('Error fetching data:', error);
            },
        });
    }

    translateData() {
        if (!this.data || !Array.isArray(this.data)) return;

        this.data.forEach((course: any) => {
            course.translatedTitle =
                this.translateService.instant(course.title) || course.title;
            course.translatedDescription =
                this.translateService.instant(course.description) ||
                course.description;
        });
    }
}
