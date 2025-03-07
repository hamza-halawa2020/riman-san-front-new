import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-cta',
    standalone: true,
    imports: [RouterLink, NgIf, NgClass,TranslateModule],
    templateUrl: './cta.component.html',
    styleUrl: './cta.component.scss'
})
export class CtaComponent {

    constructor (
        public router: Router
    ) {}

}