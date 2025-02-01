import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { InstructorService } from './instructor.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-team-page',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        HttpClientModule,
    ],
    templateUrl: './team-page.component.html',
    styleUrl: './team-page.component.scss',
    providers: [InstructorService],
})
export class TeamPageComponent implements OnInit {
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
