import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { InstructorService } from './instructor.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { SafeUrlPipe } from '../../safe-url.pipe';

@Component({
    selector: 'app-team-details-page',
    standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        CommonModule,
        NgIf,
        NgClass,
        FooterComponent,
        BackToTopComponent,
        SafeUrlPipe,
    ],
    templateUrl: './team-details-page.component.html',
    styleUrl: './team-details-page.component.scss',
})
export class TeamDetailsPageComponent implements OnInit {
    details: any;
    data: any;
    id: any;
    image = environment.imgUrl + 'instructors/';
    courseImage = environment.imgUrl + 'Courses/';
    constructor(
        private activateRoute: ActivatedRoute,
        private instructorService: InstructorService
    ) {}

    ngOnInit(): void {
        this.getDetails();
    }
    // Video Popup
    isOpen = false;
    openPopup(): void {
        this.isOpen = true;
    }
    closePopup(): void {
        this.isOpen = false;
    }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.instructorService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
               
            });
        });
    }

    
}
