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
import { FavouriteClientService } from './favourite-client.service';
import { ClientCartService } from '../client-cart/client-cart.service';

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
    favItems: any[] = [];
    image = environment.imgUrl + 'products/';

    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        public router: Router,
        private clientFavService: FavouriteClientService,
        private clientCartService: ClientCartService
    ) {}

    ngOnInit(): void {
        this.fetchFavData();
    }

    fetchFavData() {
        this.clientFavService.client_fav$.subscribe((client_fav) => {
            this.favItems = client_fav || [];
        });
    }

    deleteItem(productId: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to remove this item from the fav?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
        }).then((result: any) => {
            if (result.isConfirmed) {
                try {
                    this.clientFavService.removeFromFav(productId);
                    this.clientFavService.refreshFav();

                    Swal.fire({
                        title: 'Removed!',
                        text: 'Product removed from fav successfully.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'An unexpected error occurred.',
                        icon: 'error',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            }
        });
    }

    clearFav() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to clear the fav?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, clear it!',
            cancelButtonText: 'Cancel',
        }).then((result: any) => {
            if (result.isConfirmed) {
                try {
                    this.clientFavService.clearFav();
                    this.clientFavService.refreshFav();

                    localStorage.removeItem('checkoutData');
                    localStorage.removeItem('totalPriceData');
                    Swal.fire({
                        title: 'clear!',
                        text: 'Your fav is clear.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'An unexpected error occurred.',
                        icon: 'error',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            }
        });
    }

    addToCart(product: any) {
        const client_cart = this.clientCartService.cartSubject.value;

        if (!client_cart || !Array.isArray(client_cart)) {
            this.errorMessage = 'Cart data is not available yet.';
            return;
        }

        const exists = client_cart.some(
            (item) => item && item.product_id === product.id
        );

        if (exists) {
            this.errorMessage = 'Product is already in the cart!';
            setTimeout(() => {
                this.errorMessage = '';
            }, 1000);
        } else {
            const productToAdd = { ...product, quantity: 1 };
            this.clientCartService.addToClientCart(productToAdd);

            this.successMessage = 'Product added to cart successfully!';
            setTimeout(() => {
                this.successMessage = '';
            }, 1000);
        }
    }

    // addToCart(product: any) {
    //     const client_cart = this.clientCartService.cartSubject.value;

    //     if (!client_cart || !Array.isArray(client_cart)) {
    //         this.errorMessage = 'Cart data is not available yet.';
    //         return;
    //     }

    //     const exists = client_cart.some(
    //         (item) => item && item.product_id === product.id
    //     );

    //     if (exists) {
    //         this.errorMessage = 'Product is already in the cart!';
    //         setTimeout(() => {
    //             this.errorMessage = '';
    //         }, 1000);

    //         // const itemIndex = this.data.findIndex(
    //         //     (item: any) => item.product_id === product_id
    //         // );

    //         // if (itemIndex !== -1) {
    //         //     const favouriteId = this.data[itemIndex].id; // ID الخاص بالـ Favourite

    //         //     this.clientFavService.removeFromFav(favouriteId);
    //         // }
    //     } else {
    //         const productToAdd = { ...product, quantity: 1 };
    //         this.clientCartService.addToClientCart(productToAdd);

    //         this.successMessage = 'Product added to cart successfully!';
    //         setTimeout(() => {
    //             this.successMessage = '';
    //         }, 1000);
    //     }
    // }
}
