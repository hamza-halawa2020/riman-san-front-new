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
import { CoursesService } from './courses.service';
import { FormsModule } from '@angular/forms';
import { TruncateDescriptionPipe } from '../../truncate-description.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoginService } from '../login-page/login.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-course-details-page',
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
        TruncateDescriptionPipe,
        RatingModule,
        FormsModule,
        TranslateModule, // Added TranslateModule
    ],
    templateUrl: './course-details-page.component.html',
    styleUrls: ['./course-details-page.component.scss'],
})
export class CourseDetailsPageComponent implements OnInit {
    activeTab: string = 'overview'; // Default active tab

    switchTab(tab: string) {
        this.activeTab = tab;
    }
    details: any;
    data: any;
    isLoggedIn: boolean = false;
    videoUrlSafe!: SafeResourceUrl;
    successMessage: string = '';
    errorMessage: string = '';
    id: any;
    newReview: string = '';
    newRate: number = 0;

    image = environment.imgUrl + 'Courses/';
    instructorImage = environment.imgUrl + 'instructors/';
    socialImage = environment.imgUrl + 'socials/';

    constructor(
        private activateRoute: ActivatedRoute,
        private courseService: CoursesService,
        private sanitizer: DomSanitizer,
        private loginService: LoginService,
        public translateService: TranslateService // Made public
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
    }

    ngOnInit(): void {
        this.getDetails();
        this.fetchdata();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    fetchdata() {
        this.courseService.allSocial().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
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

    getDetails() {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.courseService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
                if (this.details?.video_url) {
                    if (this.details.video_url.includes('youtube.com/watch')) {
                        try {
                            const url = new URL(this.details.video_url);
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
                this.translateData();
            });
        });
    }

    translateData() {
        if (!this.details) return;
        this.details.translatedTitle =
            this.translateService.instant(this.details.title) ||
            this.details.title;
        this.details.translatedDescription =
            this.translateService.instant(this.details.description) ||
            this.details.description;
    }

    addReview(reviewText: string, rating: number) {
        if (!reviewText || reviewText.trim() === '') {
            this.errorMessage = this.translateService.instant(
                'REVIEW_CANNOT_BE_EMPTY'
            );
            setTimeout(() => (this.errorMessage = ''), 1000);
            return;
        }

        const reviewData = {
            course_id: this.id,
            review: reviewText,
            rating: rating || 0,
        };

        this.courseService.addReview(reviewData).subscribe({
            next: (response) => {
                this.getDetails();
                this.details.courseReviews.unshift(response);
                this.successMessage = this.translateService.instant(
                    'REVIEW_UNDER_REVIEW'
                );
                setTimeout(() => (this.successMessage = ''), 3000);
                this.newReview = '';
                this.newRate = 0;
            },
            error: (error) => {
                this.errorMessage =
                    error.error?.message ||
                    this.translateService.instant('UNEXPECTED_ERROR');
                setTimeout(() => (this.errorMessage = ''), 1000);
            },
        });
    }
}
