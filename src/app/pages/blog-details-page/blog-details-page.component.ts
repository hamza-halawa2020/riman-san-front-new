import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { environment } from '../../../environments/environment.development';
import { PostsService } from './posts.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login-page/login.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ar } from 'date-fns/locale'; // Import Arabic locale
import { enUS } from 'date-fns/locale'; // Import English locale

@Component({
    selector: 'app-blog-details-page',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        NavbarComponent,
        CarouselModule,
        PageBannerComponent,
        FooterComponent,
        NgIf,
        NgClass,
        BackToTopComponent,
        HttpClientModule,
        FormsModule,
        TranslateModule,
    ],
    templateUrl: './blog-details-page.component.html',
    styleUrl: './blog-details-page.component.scss',
})
export class BlogDetailsPageComponent implements OnInit {
    details: any; // Should be an object with nested arrays (e.g., postComments)
    isLoggedIn: boolean = false;
    sliderData: any[] = []; // Array of sidebar banners
    randomData: any[] = []; // Array of random posts
    newComment: string = ''; // Typed as string for comment input
    data: any[] = []; // Array of social data
    id: any;
    image = environment.imgUrl + 'posts/';
    userImage = environment.imgUrl + 'users/';
    socialImage = environment.imgUrl + 'socials/';
    sliderImage = environment.imgUrl + 'side-bar/';
    successMessage: string = '';
    errorMessage: string = '';
    currentOptions: OwlOptions;


    constructor(
        private activateRoute: ActivatedRoute,
        private postService: PostsService,
        private loginService: LoginService,
        public translateService: TranslateService // Injected as public for template access
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
        this.currentOptions =
        this.translateService.currentLang === 'ar'
            ? this.ProductSliderSlides2
            : this.ProductSliderSlides;
    this.translateService.onLangChange.subscribe((event) => {
        this.currentOptions =
            event.lang === 'ar'
                ? this.ProductSliderSlides2
                : this.ProductSliderSlides;
        this.translateData(); // Re-translate data on language change
    });
    }

    ngOnInit(): void {
        this.getDetails();
        this.fetchdata();
        this.fetchSiderBarData();
        this.fetchRandomData();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    fetchdata() {
        this.postService.allSocial().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0] as any[];
            },
            error: (error) => {
                this.handleError(error);
            },
        });
    }

    fetchSiderBarData() {
        this.postService.allSideBarBanners().subscribe({
            next: (response) => {
                this.sliderData = Object.values(response)[0] as any[];
                this.translateData();
            },
            error: (error) => {
                this.handleError(error);
            },
        });
    }

    fetchRandomData() {
        this.postService.randomPosts().subscribe({
            next: (response) => {
                this.randomData = Object.values(response)[0] as any[];
                this.translateData();
            },
            error: (error) => {
                this.handleError(error);
            },
        });
    }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.postService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
                this.translateData();
            });
        });
    }

    addComment(commentText: string) {
        if (!commentText || commentText.trim() === '') {
            this.errorMessage =
                this.translateService.instant('YOUR_MESSAGE') +
                ' ' +
                this.translateService.instant('ERROR');
            setTimeout(() => (this.errorMessage = ''), 1000);
            return;
        }
        const commentData = {
            post_id: this.id,
            comment: commentText,
        };

        this.postService.addComment(commentData).subscribe({
            next: (response) => {
                this.details.postComments.push(response);
                this.getDetails();
                this.successMessage =
                    this.translateService.instant('COMMENT_ADDED');
                setTimeout(() => {
                    this.successMessage = '';
                }, 2000);
                this.newComment = '';
            },
            error: (error) => {
                this.handleError(error);
            },
        });
    }

    private handleError(error: any) {
        if (error.error?.errors) {
            this.errorMessage = Object.values(error.error.errors)
                .flat()
                .join(' | ');
        } else {
            this.errorMessage =
                error.error?.message ||
                this.translateService.instant('UNEXPECTED_ERROR');
        }
        setTimeout(() => {
            this.errorMessage = '';
        }, 3000);
    }

    translateData() {
        if (this.details) {
            this.details.translatedTitle =
                this.translateService.instant(this.details.title) ||
                this.details.title;
            this.details.translatedContent =
                this.translateService.instant(this.details.content) ||
                this.details.content;
            this.details.translatedAdmin =
                this.translateService.instant(this.details.admin) ||
                this.details.admin;
            this.details.translatedCategory =
                this.translateService.instant(this.details.category) ||
                this.details.category;
            this.details.translatedTag =
                this.translateService.instant(this.details.tag) ||
                this.details.tag;
            if (this.details.postComments) {
                this.details.postComments.forEach((comment: any) => {
                    comment.translatedUser =
                        this.translateService.instant(comment.user) ||
                        comment.user;
                    comment.translatedComment =
                        this.translateService.instant(comment.comment) ||
                        comment.comment;
                });
            }
        }
        if (this.randomData) {
            this.randomData.forEach((post: any) => {
                post.translatedTitle =
                    this.translateService.instant(post.title) || post.title;
            });
        }
    }

    ProductSliderSlides: OwlOptions = {
        nav: false,
        loop: true,
        margin: 25,
        dots: false,
        autoplay: true,
        smartSpeed: 500,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            515: {
                items: 1,
            },
            695: {
                items: 2,
            },
            935: {
                items: 2,
            },
            1115: {
                items: 2,
            },
        },
    };
    ProductSliderSlides2: OwlOptions = {
        nav: false,
        loop: true,
        margin: 25,
        dots: false,
        rtl: true,
        autoplay: true,
        smartSpeed: 500,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            515: {
                items: 1,
            },
            695: {
                items: 2,
            },
            935: {
                items: 2,
            },
            1115: {
                items: 2,
            },
        },
    };
}
