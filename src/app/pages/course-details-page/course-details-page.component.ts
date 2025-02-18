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
    ],
    templateUrl: './course-details-page.component.html',
    styleUrl: './course-details-page.component.scss',
})
export class CourseDetailsPageComponent implements OnInit {
    activeTab: string = 'overview'; // Default active tab

    switchTab(tab: string) {
        this.activeTab = tab;
    }
    details: any;
    data: any;
    videoUrlSafe!: SafeResourceUrl;

    id: any;
    image = environment.imgUrl + 'Courses/';
    instructorImage = environment.imgUrl + 'instructors/';
    socialImage = environment.imgUrl + 'socials/';
    constructor(
        private activateRoute: ActivatedRoute,
        private courseService: CoursesService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.getDetails();
        this.fetchdata();
    }

    fetchdata() {
        this.courseService.allSocial().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
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
            });
        });
    }
}
