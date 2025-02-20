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
        CommonModule,
        NgIf,
        NgClass,
        TruncateDescriptionPipe,
    ],
    templateUrl: './courses-page.component.html',
    styleUrl: './courses-page.component.scss',
    providers: [CourseService],
})
export class CoursesPageComponent implements OnInit {
    data: any;
    videoUrlSafe!: SafeResourceUrl;
    image = environment.imgUrl + 'Courses/';
    imageInstructor = environment.imgUrl + 'instructors/';
    constructor(
        public router: Router,
        private coursesService: CourseService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.fetchData();
    }

    isOpen = false;

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
                this.data = Object.values(response)[0];

                if (this.data?.video_url) {
                    if (this.data.video_url.includes('youtube.com/watch')) {
                        try {
                            const url = new URL(this.data.video_url);
                            const videoId = url.searchParams.get('v');

                            if (videoId) {
                                let safeUrl = `https://www.youtube.com/embed/${videoId}`;
                                this.videoUrlSafe =
                                    this.sanitizer.bypassSecurityTrustResourceUrl(
                                        safeUrl
                                    );
                            }
                        } catch (error) {
                            console.error('Invalid URL:', error);
                        }
                    }
                }
            },
            error: (error) => console.error('Error fetching data:', error),
        });
    }
}
