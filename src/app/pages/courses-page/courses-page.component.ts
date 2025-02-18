import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { Router } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { CourseService } from './course.service';
import { CommonModule, NgIf } from '@angular/common';
import { CoursesComponent } from '../../common/courses/courses.component';

@Component({
    selector: 'app-courses-page',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,

        CoursesComponent,
    ],
    templateUrl: './courses-page.component.html',
    styleUrl: './courses-page.component.scss',
    providers: [CourseService],
})
export class CoursesPageComponent implements OnInit {
    constructor(public router: Router) {}

    ngOnInit(): void {}
}
