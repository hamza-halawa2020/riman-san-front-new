import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { Router, RouterLink } from '@angular/router';
import { ContactComponent } from '../../common/contact/contact.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { CourseService } from './course.service';
import { environment } from '../../../environments/environment.development';
import { CommonModule, NgIf } from '@angular/common';
import { SafeUrlPipe } from '../../safe-url.pipe';

@Component({
    selector: 'app-courses-page',
    standalone: true,
    imports: [
        RouterLink,
        NgIf,
        CommonModule,
        NavbarComponent,
        PageBannerComponent,
        ContactComponent,
        FooterComponent,
        BackToTopComponent,
        HttpClientModule,
        SafeUrlPipe,
    ],
    templateUrl: './courses-page.component.html',
    styleUrl: './courses-page.component.scss',
    providers: [CourseService],
})
export class CoursesPageComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'Courses/';
    imageInstructor = environment.imgUrl + 'instructors/';
    showVideo = false;

    constructor(public router: Router, private courseService: CourseService) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
        this.isOpen = false;
    }

    fetchdata() {
        this.courseService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
                if (this.data.video_url.includes('youtube.com/watch')) {
                    const url = new URL(this.data.video_url);
                    const videoId = url.searchParams.get('v');

                    if (videoId) {
                        const siParam = url.searchParams.get('si');
                        this.data.video_url = `https://www.youtube.com/embed/${videoId}`;

                        if (siParam) {
                            this.data.video_url += `?si=${siParam}`;
                        }
                    }
                }
            },
            error: (error) => {},
        });
    }
}
