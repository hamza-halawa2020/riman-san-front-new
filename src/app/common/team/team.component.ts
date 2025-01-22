import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-team',
    standalone: true,
    imports: [RouterLink, NgClass, NgIf],
    templateUrl: './team.component.html',
    styleUrl: './team.component.scss'
})
export class TeamComponent {

    constructor (
        public router: Router
    ) {}

}