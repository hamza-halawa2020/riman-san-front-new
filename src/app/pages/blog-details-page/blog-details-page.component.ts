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
    ],
    templateUrl: './blog-details-page.component.html',
    styleUrl: './blog-details-page.component.scss',
})
export class BlogDetailsPageComponent {
    details: any;
    sliderData: any;
    randomData: any;

    data: any;
    id: any;
    image = environment.imgUrl + 'posts/';
    userImage = environment.imgUrl + 'users/';
    socialImage = environment.imgUrl + 'socials/';
    sliderImage = environment.imgUrl + 'side-bar/';
    constructor(
        private activateRoute: ActivatedRoute,
        private postService: PostsService
    ) {}
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
            error: (error) => {},
        });
    }
    fetchSiderBarData() {
        this.postService.allSideBarBanners().subscribe({
            next: (response) => {
                this.sliderData = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }
    fetchRandomData() {
        this.postService.randomPosts().subscribe({
            next: (response) => {
                this.randomData = Object.values(response)[0];
            },
            error: (error) => {},
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
