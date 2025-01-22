import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-features',
    standalone: true,
    imports: [RouterLink, NgClass, NgIf],
    templateUrl: './features.component.html',
    styleUrl: './features.component.scss'
})
export class FeaturesComponent {

    constructor (
        public router: Router
    ) {}

    // Toggle Class
    isActive1 = true;  // First div is active by default
    isActive2 = false;
    isActive3 = false;
    toggleClass(divNumber: number) {
        // Reset all divs to inactive
        this.isActive1 = false;
        this.isActive2 = false;
        this.isActive3 = false;
        // Set the clicked div as active
        if (divNumber === 1) {
            this.isActive1 = true;
        } else if (divNumber === 2) {
            this.isActive2 = true;
        } else if (divNumber === 3) {
            this.isActive3 = true;
        }
    }

}