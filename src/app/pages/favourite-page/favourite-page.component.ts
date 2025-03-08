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
import { CartService } from '../cart-page/cart.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

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
        TranslateModule, // Added for translations
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
        private favouriteService: FavouriteService,
        private cartService: CartService,
        public translateService: TranslateService // Injected for translation
    ) {}

    ngOnInit(): void {
        this.fetchdata();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData(); // Re-translate data on language change
        });
    }

    fetchdata() {
        this.favouriteService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
                this.translateData();
            },
            error: (error) => {
                this.handleError(error);
            },
        });
    }

    deleteItem(id: number) {
        const areYouSure = this.translateService.instant('ARE_YOU_SURE');
        const removeItemConfirm = this.translateService.instant(
            'REMOVE_ITEM_CONFIRM'
        );
        const yesRemoveIt = this.translateService.instant('YES_REMOVE_IT');
        const cancel = this.translateService.instant('CANCEL');
        const removed = this.translateService.instant('REMOVED');
        const productRemovedSuccess = this.translateService.instant(
            'PRODUCT_REMOVED_SUCCESS'
        );

        Swal.fire({
            title: areYouSure,
            text: removeItemConfirm,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: yesRemoveIt,
            cancelButtonText: cancel,
            customClass: {
                popup:
                    this.translateService.currentLang === 'ar'
                        ? 'swal-rtl'
                        : 'swal-ltr',
            },
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.favouriteService.delete(id).subscribe({
                    next: () => {
                        this.data = this.data.filter(
                            (item: any) => item.id !== id
                        );
                        Swal.fire({
                            title: removed,
                            text: productRemovedSuccess,
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                            customClass: {
                                popup:
                                    this.translateService.currentLang === 'ar'
                                        ? 'swal-rtl'
                                        : 'swal-ltr',
                            },
                        });
                    },
                    error: (error) => {
                        this.handleError(error);
                    },
                });
            }
        });
    }

    clearFav() {
        const areYouSure = this.translateService.instant('ARE_YOU_SURE');
        const clearWishlistConfirm = this.translateService.instant(
            'CLEAR_WISHLIST_CONFIRM'
        );
        const yesClearIt = this.translateService.instant('YES_CLEAR_IT');
        const cancel = this.translateService.instant('CANCEL');
        const cleared = this.translateService.instant('CLEAR');
        const wishlistClearedSuccess = this.translateService.instant(
            'WISHLIST_CLEARED_SUCCESS'
        );

        Swal.fire({
            title: areYouSure,
            text: clearWishlistConfirm,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: yesClearIt,
            cancelButtonText: cancel,
            customClass: {
                popup:
                    this.translateService.currentLang === 'ar'
                        ? 'swal-rtl'
                        : 'swal-ltr',
            },
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.favouriteService.clearFav().subscribe({
                    next: () => {
                        this.fetchdata();
                        Swal.fire({
                            title: cleared,
                            text: wishlistClearedSuccess,
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                            customClass: {
                                popup:
                                    this.translateService.currentLang === 'ar'
                                        ? 'swal-rtl'
                                        : 'swal-ltr',
                            },
                        });
                    },
                    error: (error) => {
                        this.handleError(error);
                    },
                });
            }
        });
    }

    addToCart(product_id: any) {
        const payload = { product_id: product_id };

        this.cartService.addToCart(payload).subscribe({
            next: (response) => {
                this.successMessage = this.translateService.instant(
                    'PRODUCT_ADDED_TO_CART'
                );
                setTimeout(() => {
                    this.successMessage = '';
                }, 1000);

                const itemIndex = this.data.findIndex(
                    (item: any) => item.product_id === product_id
                );
                if (itemIndex !== -1) {
                    const favouriteId = this.data[itemIndex].id;
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

    private translateData() {
        // Translate product titles if needed (optional, based on your data structure)
        if (this.data) {
            this.data.forEach((item: any) => {
                item.product.translatedTitle =
                    this.translateService.instant(item.product.title) ||
                    item.product.title;
            });
        }
    }
}
