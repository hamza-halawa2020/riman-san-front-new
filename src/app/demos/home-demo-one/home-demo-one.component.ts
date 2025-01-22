import { Component } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { FeaturesComponent } from '../../common/features/features.component';
import { AboutComponent } from '../../common/about/about.component';
import { CoursesComponent } from '../../common/courses/courses.component';
import { WhyUsComponent } from '../../common/why-us/why-us.component';
import { UpcomingCoursesComponent } from '../../common/upcoming-courses/upcoming-courses.component';
import { CtaComponent } from '../../common/cta/cta.component';
import { TeamComponent } from '../../common/team/team.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { BlogComponent } from '../../common/blog/blog.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FeedbackComponent } from '../../common/feedback/feedback.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';

@Component({
    selector: 'app-home-demo-one',
    standalone: true,
    imports: [NavbarComponent, BannerComponent, FeaturesComponent, AboutComponent, CoursesComponent, WhyUsComponent, UpcomingCoursesComponent, FeedbackComponent, CtaComponent, TeamComponent, ContactComponent, BlogComponent, FooterComponent, BackToTopComponent],
    templateUrl: './home-demo-one.component.html',
    styleUrl: './home-demo-one.component.scss'
})
export class HomeDemoOneComponent {}