import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { InstructorService } from './instructor.service';
import { environment } from '../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-team',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        NgIf,
        NgClass,
        HttpClientModule,
        TranslateModule,
    ],
    templateUrl: './team.component.html',
    styleUrl: './team.component.scss',
    providers: [InstructorService],
})
export class TeamComponent implements OnInit {
    data: any[] = []; // Explicitly typed as an array
    image = environment.imgUrl + 'instructors/';

    constructor(
        public router: Router,
        private instructorService: InstructorService,
        public translateService: TranslateService // Injected TranslateService
    ) {}

    ngOnInit(): void {
        this.fetchdata();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    fetchdata() {
        this.instructorService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0] as any[];
                this.translateData();
            },
            error: (error) => {
                console.error('Error fetching data:', error);
            },
        });
    }

    translateData() {
        if (!this.data || !Array.isArray(this.data)) return;

        this.data.forEach((instructor: any) => {
            instructor.translatedName = this.translateService.instant(instructor.name) || instructor.name;
            instructor.translatedJobTitle = this.translateService.instant(instructor.job_title) || instructor.job_title;
        });
    }
}