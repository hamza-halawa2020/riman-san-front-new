import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [RouterLink, NgClass, NgIf],
    templateUrl: './courses.component.html',
    styleUrl: './courses.component.scss'
})
export class CoursesComponent {

    constructor (
        public router: Router
    ) {}

}