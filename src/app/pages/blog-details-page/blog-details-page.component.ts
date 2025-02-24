import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
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
    ],
    templateUrl: './blog-details-page.component.html',
    styleUrl: './blog-details-page.component.scss',
})
export class BlogDetailsPageComponent {
    details: any;
    isLoggedIn: boolean = false;

    sliderData: any;
    randomData: any;
    newComment: any;
    data: any;
    id: any;
    image = environment.imgUrl + 'posts/';
    userImage = environment.imgUrl + 'users/';
    socialImage = environment.imgUrl + 'socials/';
    sliderImage = environment.imgUrl + 'side-bar/';
    successMessage: string = '';
    errorMessage: string = '';
    constructor(
        private activateRoute: ActivatedRoute,
        private postService: PostsService,
        private loginService: LoginService
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
    }
    ngOnInit(): void {
        this.getDetails();
        this.fetchdata();
        this.fetchSiderBarData();
        this.fetchRandomData();
    }

    fetchdata() {
        this.postService.allSocial().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
        });
    }
    fetchSiderBarData() {
        this.postService.allSideBarBanners().subscribe({
            next: (response) => {
                this.sliderData = Object.values(response)[0];
            },
            error: (error) => {
                if (error.error?.errors) {
                    this.errorMessage = Object.values(
                        error.error.errors
                    )
                        .flat()
                        .join(' | ');
                } else {
                    this.errorMessage = error.error?.message || 'An unexpected error occurred.';

                }
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }
    fetchRandomData() {
        this.postService.randomPosts().subscribe({
            next: (response) => {
                this.randomData = Object.values(response)[0];
            },
            error: (error) => {
                if (error.error?.errors) {
                    this.errorMessage = Object.values(
                        error.error.errors
                    )
                        .flat()
                        .join(' | ');
                } else {
                    this.errorMessage =  error.error?.message || 'An unexpected error occurred.';

                }
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    getDetails(): void {
        this.activateRoute.params.subscribe((params) => {
            this.id = +params['id'];
            this.postService.show(this.id).subscribe((data) => {
                this.details = Object.values(data)[0];
            });
        });
    }

    addComment(commentText: string) {
        if (!commentText || commentText.trim() === '') {
            this.errorMessage = 'Comment cannot be empty!';
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
                    'Comment added successfully but it is under review!';

                setTimeout(() => {
                    this.successMessage = '';
                }, 2000);

                this.newComment = '';
            },
            error: (error) => {
                if (error.error?.errors) {
                    this.errorMessage = Object.values(
                        error.error.errors
                    )
                        .flat()
                        .join(' | ');
                } else {
                    this.errorMessage = error.error?.message || 'An unexpected error occurred.';

                }
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
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
}
