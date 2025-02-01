import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { CoursesService } from './courses.service';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [
        RouterLink,
        RouterLink,
        CommonModule,
        NgIf,
        NgClass,
        HttpClientModule,
    ],
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss',
    providers: [CoursesService],
})
export class CoursesComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'Courses/';
    imageInstructor = environment.imgUrl + 'instructors/';

    constructor(
        public router: Router,
        private coursesService: CoursesService
    ) {}
    ngOnInit(): void {
        this.fetchData();
    }

    fetchData() {
        this.coursesService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {
            },
        });
    }

    
}
