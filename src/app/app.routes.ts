import { Routes } from '@angular/router';
import { HomeDemoOneComponent } from './demos/home-demo-one/home-demo-one.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { CoursesPageComponent } from './pages/courses-page/courses-page.component';
import { CourseDetailsPageComponent } from './pages/course-details-page/course-details-page.component';
import { TeamPageComponent } from './pages/team-page/team-page.component';
import { TeamDetailsPageComponent } from './pages/team-details-page/team-details-page.component';
import { BlogPageComponent } from './pages/blog-page/blog-page.component';
import { BlogDetailsPageComponent } from './pages/blog-details-page/blog-details-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';
import { TermsConditionsPageComponent } from './pages/terms-conditions-page/terms-conditions-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { AuthGuard } from './auth.guard';
import { unAuthGuard } from './un-auth.guard';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductDetailsPageComponent } from './pages/product-details-page/product-details-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';


export const routes: Routes = [
    { path: '', component: HomeDemoOneComponent },
    { path: 'about', component: AboutPageComponent },
    { path: 'courses', component: CoursesPageComponent },
    { path: 'course/:id', component: CourseDetailsPageComponent },
    { path: 'instructors', component: TeamPageComponent },
    { path: 'instructor/:id', component: TeamDetailsPageComponent },
    { path: 'posts', component: BlogPageComponent },
    { path: 'post/:id', component: BlogDetailsPageComponent },
    { path: 'products', component: ProductPageComponent },
    { path: 'product/:id', component: ProductDetailsPageComponent },
    { path: 'events', component:  EventPageComponent},
    { path: 'event/:id', component:  },
    { path: 'cart', component: CartPageComponent },
    { path: 'checkout', component: CheckoutPageComponent },
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [unAuthGuard],
    },
    {
        path: 'profile',
        component: ProfilePageComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [unAuthGuard],
    },
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'terms-conditions', component: TermsConditionsPageComponent },
    { path: 'contacts', component: ContactPageComponent },
    // Here add new pages component

    { path: '**', component: ErrorPageComponent }, // This line will remain down from the whole pages component list
];
