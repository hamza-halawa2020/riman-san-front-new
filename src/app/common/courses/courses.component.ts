import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { CoursesService } from './courses.service';
import { SafeUrlPipe } from '../../safe-url.pipe';

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
        SafeUrlPipe,
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
    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
        this.isOpen = false;
    }

    fetchData() {
        this.coursesService.index().subscribe({
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
