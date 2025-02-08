import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { InstructorService } from './instructor.service';
import { environment } from '../../../environments/environment.development';

@Component({
    selector: 'app-team',
    standalone: true,
    imports: [RouterLink, CommonModule, NgIf, NgClass, HttpClientModule],
    templateUrl: './team.component.html',
    styleUrl: './team.component.scss',
    providers: [InstructorService],
})
export class TeamComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'instructors/';

    constructor(
        public router: Router,
        private instructorService: InstructorService
    ) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.instructorService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }
}
