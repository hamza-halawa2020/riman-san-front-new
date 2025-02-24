import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { environment } from '../../../environments/environment.development';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { CartService } from '../cart-page/cart.service';
import { FavouriteClientService } from './favourite-client.service';

@Component({
    selector: 'app-favourite-client-page',
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
    templateUrl: './favourite-client-page.component.html',
    styleUrl: './favourite-client-page.component.scss',
    providers: [FavouriteClientService],
})
export class FavouriteClientPageComponent implements OnInit {
    data: any;
    image = environment.imgUrl + 'products/';
    successMessage: string = '';
    errorMessage: string = '';
    constructor(
        public router: Router,
        private favouriteService: FavouriteClientService,
        private cartService: CartService
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
                this.favouriteService.clearFav().subscribe({
                    next: () => {
                        this.fetchdata();

                        Swal.fire({
                            title: 'clear!',
                            text: 'Your Whishlist is clear.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                        });
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

    addToCart(product_id: any) {
        const payload = { product_id: product_id };

        this.cartService.addToCart(payload).subscribe({
            next: (response) => {
                this.successMessage = 'Product added to cart successfully!';
                setTimeout(() => {
                    this.successMessage = '';
                }, 1000);

                // البحث عن العنصر في قائمة الـ favorites
                const itemIndex = this.data.findIndex(
                    (item: any) => item.product_id === product_id
                );

                if (itemIndex !== -1) {
                    const favouriteId = this.data[itemIndex].id; // ID الخاص بالـ Favourite

                    this.favouriteService.delete(favouriteId).subscribe({
                        next: () => {
                            this.data.splice(itemIndex, 1);
                        },
                        error: (error) => {
                            console.log(
                                'Error deleting from favourites:',
                                error
                            );
                        },
                    });
                }
            },
            error: (error) => {
                if (error.error?.errors) {
                    this.errorMessage = Object.values(error.error.errors)
                        .flat()
                        .join(' | ');
                } else {
                    this.errorMessage =
                        error.error?.message || 'An unexpected error occurred.';
                }
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }
}
