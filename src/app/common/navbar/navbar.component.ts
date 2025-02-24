import { NgClass, NgIf } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoginService } from '../../pages/login-page/login.service';
import { CartService } from '../../pages/cart-page/cart.service';
import { Subscription } from 'rxjs';
import { FavouriteService } from '../../pages/favourite-page/favourite.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientCartService } from '../../pages/client-cart/client-cart.service';
import { FavouriteClientService } from '../../pages/favourite-client-page/favourite-client.service';
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgIf, NgClass, NgbCollapseModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
    isCollapsed = true;
    cartData: any[] = [];
    cartClientData: any[] = [];
    favClientData: any[] = [];
    favData: any[] = [];

    public cartSubscription!: Subscription;
    public cartClientSubscription!: Subscription;
    public favSubscription!: Subscription;
    public favClientSubscription!: Subscription;

    // ngOnInit(): void {
    //     this.cartSubscription = this.cartService.cart$.subscribe((cart) => {
    //         this.cartData = cart;
    //     });

    //     this.cartClientSubscription = this.cartClientService.cart$.subscribe(
    //         (cart) => {
    //             this.cartClientData = cart; // Assign to cartClientData
    //         }
    //     );

    //     this.favSubscription = this.favouriteService.fav$.subscribe((fav) => {
    //         this.favData = fav;
    //     });

    //     this.router.events.subscribe(() => {
    //         this.cartService.refreshCart();
    //     });
    //     this.router.events.subscribe(() => {
    //         this.favouriteService.refreshFav();
    //     });
    // }

    ngOnInit(): void {
        this.cartSubscription = this.cartService.cart$.subscribe((cart) => {
            this.cartData = cart;
        });

        this.cartClientSubscription = this.cartClientService.cart$.subscribe(
            (cart) => {
                this.cartClientData = cart;
            }
        );

        this.favSubscription = this.favouriteService.fav$.subscribe((fav) => {
            this.favData = fav;
        });
        this.favClientSubscription = this.favClientouriteService.fav$.subscribe(
            (favClient) => {
                this.favClientData = favClient;
            }
        );

        this.router.events.subscribe(() => {
            this.cartService.refreshCart();
            this.cartClientService.refreshCart(); // Add this line
        });
        this.router.events.subscribe(() => {
            this.favouriteService.refreshFav();
            this.favClientouriteService.refreshFav();
        });
    }

    ngOnDestroy() {
        if (this.cartSubscription) {
            this.cartSubscription.unsubscribe();
        }
        if (this.cartClientSubscription) {
            this.cartClientSubscription.unsubscribe();
        }
        if (this.favSubscription) {
            this.favSubscription.unsubscribe();
        }
        if (this.favClientSubscription) {
            this.favClientSubscription.unsubscribe();
        }
    }

    isLoggedIn: boolean = false;
    data: any;
    favouriteData: any;
    constructor(
        public router: Router,
        public loginService: LoginService,
        private cartService: CartService,
        private cartClientService: ClientCartService,
        private favouriteService: FavouriteService,
        private favClientouriteService: FavouriteClientService
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
    }

    // Navbar Sticky
    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition =
            window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    logout() {
        this.loginService.logout();
    }
}
