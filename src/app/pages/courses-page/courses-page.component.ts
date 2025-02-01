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
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-courses-page',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        NavbarComponent,
        PageBannerComponent,
        ContactComponent,
        FooterComponent,
        BackToTopComponent,
        HttpClientModule,
    ],
    templateUrl: './courses-page.component.html',
    styleUrl: './courses-page.component.scss',
    providers: [CourseService],
})
export class CoursesPageComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'Courses/';
    imageInstructor = environment.imgUrl + 'instructors/';

    constructor(
        public router: Router,
        private courseService: CourseService
    ) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.courseService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {
            },
        });
    }
}
