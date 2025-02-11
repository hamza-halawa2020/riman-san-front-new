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
import { SafeUrlPipe } from '../../safe-url.pipe';
import { FormsModule } from '@angular/forms';

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
        SafeUrlPipe,
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

    id: any;
    image = environment.imgUrl + 'Courses/';
    instructorImage = environment.imgUrl + 'instructors/';
    socialImage = environment.imgUrl + 'socials/';
    constructor(
        private activateRoute: ActivatedRoute,
        private courseService: CoursesService
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

    // getDetails(): void {
    //     this.activateRoute.params.subscribe((params) => {
    //         this.id = +params['id'];
    //         this.courseService.show(this.id).subscribe((data) => {
    //             this.details = Object.values(data)[0];
    //             if (this.data.video_url.includes('youtube.com/watch')) {
    //                 const url = new URL(this.data.video_url);
    //                 const videoId = url.searchParams.get('v');

    //                 if (videoId) {
    //                     const siParam = url.searchParams.get('si');
    //                     this.data.video_url = `https://www.youtube.com/embed/${videoId}`;

    //                     if (siParam) {
    //                         this.data.video_url += `?si=${siParam}`;
    //                     }
    //                 }
    //             }
    //         });
    //     });
    // }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.courseService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
                if (this.data && this.data.video_url && this.data.video_url.includes('youtube.com/watch')) {
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
            });
        });
    }
}
