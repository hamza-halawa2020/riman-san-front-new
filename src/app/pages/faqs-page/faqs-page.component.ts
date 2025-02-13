import { Component } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { AboutComponent } from '../../common/about/about.component';
import { TeamComponent } from '../../common/team/team.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { NgClass, NgIf } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FaqsComponent } from '../../common/faqs/faqs.component';
@Component({
    selector: 'app-faqs-page',
    standalone: true,
    imports: [
        NavbarComponent,
        PageBannerComponent,
        AboutComponent,
        TeamComponent,
        ContactComponent,
        FooterComponent,
        BackToTopComponent,
        NgClass,
        NgIf,
        NgbModule,
        FaqsComponent,
    ],
    templateUrl: './faqs-page.component.html',
    styleUrl: './faqs-page.component.scss',
})
export class FaqsPageComponent {}
