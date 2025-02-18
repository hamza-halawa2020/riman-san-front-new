import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CoursesService } from './courses.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { TruncateDescriptionPipe } from '../../truncate-description.pipe';

@Component({
    selector: 'app-courses',
    standalone: true,
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
    providers: [CoursesService],
    imports: [
        CommonModule,
        NgIf,
        NgClass,
        RouterModule,
        HttpClientModule,
        TruncateDescriptionPipe,
    ],
})
export class CoursesComponent implements OnInit {
    data: any;
    videoUrlSafe!: SafeResourceUrl;
    image = environment.imgUrl + 'Courses/';
    imageInstructor = environment.imgUrl + 'instructors/';
    constructor(
        public router: Router,
        private coursesService: CoursesService,
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
