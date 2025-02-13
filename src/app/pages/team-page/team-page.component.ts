import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { InstructorService } from './instructor.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeamComponent } from '../../common/team/team.component';

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
        TeamComponent,
    ],
    templateUrl: './team-page.component.html',
    styleUrl: './team-page.component.scss',
    providers: [InstructorService],
})
export class TeamPageComponent implements OnInit {
    constructor(public router: Router) {}

    ngOnInit(): void {}
}
