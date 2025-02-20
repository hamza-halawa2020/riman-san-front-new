import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FeedbackComponent } from '../../common/feedback/feedback.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { environment } from '../../../environments/environment.development';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';
import { FavouriteService } from './favourite.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-favourite-page',
    standalone: true,
    imports: [
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        RouterLink,
        NgIf,
        NgClass,
        CommonModule,
    ],
    templateUrl: './favourite-page.component.html',
    styleUrl: './favourite-page.component.scss',
    providers: [FavouriteService],
})
export class FavouritePageComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'products/';
    successMessage: string = '';
    errorMessage: string = '';
    constructor(
        public router: Router,
        private favouriteService: FavouriteService
    ) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.favouriteService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }

    deleteItem(id: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to remove this item from the Whishlist?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.favouriteService.delete(id).subscribe({
                    next: () => {
                        this.data = this.data.filter(
                            (item: any) => item.id !== id
                        );

                        Swal.fire({
                            title: 'Removed!',
                            text: 'Product removed from Whishlist successfully.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                        });

                        this.favouriteService.notifyUpdate();
                    },
                    error: (error) => {
                        Swal.fire({
                            title: 'Error!',
                            text:
                                error.error?.message ||
                                'An unexpected error occurred.',
                            icon: 'error',
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    }

    clearFav() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to clear the Whishlist?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, clear it!',
            cancelButtonText: 'Cancel',
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.favouriteService.clearCart().subscribe({
                    next: () => {
                        this.favouriteService.notifyUpdate();
                        this.fetchdata();

                        Swal.fire({
                            title: 'clear!',
                            text: 'Your Whishlist is clear.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                        });

                        this.favouriteService.notifyUpdate();
                    },
                    error: (error) => {
                        Swal.fire({
                            title: 'Error!',
                            text:
                                error.error?.message ||
                                'An unexpected error occurred.',
                            icon: 'error',
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    }
}
