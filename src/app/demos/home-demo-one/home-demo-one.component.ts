import { Component } from '@angular/core';
import { AboutComponent } from '../../common/about/about.component';
import { CoursesComponent } from '../../common/courses/courses.component';
import { WhyUsComponent } from '../../common/why-us/why-us.component';
import { UpcomingEventsComponent } from '../../common/upcoming-events/upcoming-events.component';
import { CtaComponent } from '../../common/cta/cta.component';
import { TeamComponent } from '../../common/team/team.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { BlogComponent } from '../../common/blog/blog.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FeedbackComponent } from '../../common/feedback/feedback.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { MainSlider } from '../../common/main-slider/main-slider.component';
import { ProductSliderComponent } from '../../common/product-slider/product-slider.component';

@Component({
    selector: 'app-home-demo-one',
    standalone: true,
    imports: [
        NavbarComponent,
        FeedbackComponent,
        AboutComponent,
        CoursesComponent,
        WhyUsComponent,
        UpcomingEventsComponent,
        FeedbackComponent,
        MainSlider,
        CtaComponent,
        TeamComponent,
        ContactComponent,
        BlogComponent,
        FooterComponent,
        BackToTopComponent,
        ProductSliderComponent,
    ],
    templateUrl: './home-demo-one.component.html',
    styleUrl: './home-demo-one.component.scss',
})
export class HomeDemoOneComponent {}
