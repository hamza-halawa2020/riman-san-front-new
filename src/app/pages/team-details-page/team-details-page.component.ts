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
    ],
    templateUrl: './team-details-page.component.html',
    styleUrl: './team-details-page.component.scss',
})
export class TeamDetailsPageComponent implements OnInit {
    details: any;
    data: any;
    id: any;
    videoUrlSafe!: SafeResourceUrl;

    image = environment.imgUrl + 'instructors/';
    courseImage = environment.imgUrl + 'Courses/';
    constructor(
        private activateRoute: ActivatedRoute,
        private instructorService: InstructorService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.getDetails();
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
                this.videoUrlSafe =
                    this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
            }
        }
    }

    closePopup(): void {
        this.isOpen = false;
    }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.instructorService.show(this.id).subscribe((data) => {
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
