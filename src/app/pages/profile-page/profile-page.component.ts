import { Component } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { AboutComponent } from '../../common/about/about.component';
import { TeamComponent } from '../../common/team/team.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [NavbarComponent, PageBannerComponent, AboutComponent, TeamComponent, ContactComponent, FooterComponent, BackToTopComponent],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {}