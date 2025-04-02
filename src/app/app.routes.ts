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
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';
import { FaqsPageComponent } from './pages/faqs-page/faqs-page.component';
import { FavouritePageComponent } from './pages/favourite-page/favourite-page.component';
import { ForgetpasswordPageComponent } from './pages/forgetpassword-page/forgetpassword-page.component';
import { CartPageWrapperComponent } from './pages/cart-page-wrapper/cart-page-wrapper.component';
import { CartResolver } from './pages/cart-page-wrapper/cart.resolver';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { PaymentStatusPageComponent } from './pages/payment-status-page/payment-status-page.component';
import { VerificationCodePageComponent } from './pages/verification-code-page/verification-code-page.component';
import { SendVerificationCodePageComponent } from './pages/send-verification-code-page/send-verification-code-page.component';
import { ResetpasswordPageComponent } from './pages/resetPassword-page/resetpassword-page.component';
import { CertificationPageComponent } from './pages/certification-page/certification-page.component';
import { FactoryPageComponent } from './pages/factory-page/factory-page.component';
import { FavouritePageWrapperComponent } from './pages/favourite-page-wrapper/favourite-page-wrapper.component';
import { FavouriteResolver } from './pages/favourite-page-wrapper/favourite.resolver';
import { ShopPageComponent } from './pages/shop-page/shop-page.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';

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
    { path: 'shop', component: ShopPageComponent },
    { path: 'product/:id', component: ProductDetailsPageComponent },
    { path: 'categories/:id', component: CategoryPageComponent },
    { path: 'events', component: EventPageComponent },
    { path: 'event/:id', component: EventDetailsPageComponent },
    { path: 'checkout', component: CheckoutPageComponent },
    { path: 'faqs', component: FaqsPageComponent },
    { path: 'payment-status', component: PaymentStatusPageComponent },
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'terms-conditions', component: TermsConditionsPageComponent },
    { path: 'certifications', component: CertificationPageComponent },
    { path: 'factory', component: FactoryPageComponent },
    { path: 'contacts', component: ContactPageComponent },
    {
        path: 'forget-password',
        component: ForgetpasswordPageComponent,
        canActivate: [unAuthGuard],
    },
    {
        path: 'password-reset',
        component: ResetpasswordPageComponent,
        canActivate: [unAuthGuard],
    },
    {
        path: 'verify',
        component: VerificationCodePageComponent,
        canActivate: [unAuthGuard],
    },
    {
        path: 'send-verify',
        component: SendVerificationCodePageComponent,
        canActivate: [unAuthGuard],
    },

    {
        path: 'wishlist',
        component: FavouritePageWrapperComponent,
        resolve: { userType: FavouriteResolver },
    },
    {
        path: 'cart',
        component: CartPageWrapperComponent,
        resolve: { userType: CartResolver },
    },
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

    // Here add new pages component

    { path: '**', component: ErrorPageComponent }, // This line will remain down from the whole pages component list
];
