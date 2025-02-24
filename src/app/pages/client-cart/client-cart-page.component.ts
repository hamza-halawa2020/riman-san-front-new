import { CartService } from './../cart-page/cart.service';
import { ProductService } from './../product-page/product.service';
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
import { ClientCartService } from './client-cart.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-client-cart-page',
    standalone: true,
    imports: [
        HttpClientModule,
        CommonModule,
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        FeedbackComponent,
        FormsModule,
        NgIf,
        NgClass,
        FooterComponent,
        BackToTopComponent,
    ],
    templateUrl: './client-cart-page.component.html',
    styleUrl: './client-cart-page.component.scss',
    providers: [ClientCartService],
})
export class ClientCartPageComponent implements OnInit {
    data: any;
    cartItems: any[] = [];
    image = environment.imgUrl + 'products/';
    totalPrice: number = 0;
    countries: any[] = [];
    successMessage: string = '';
    errorMessage: string = '';
    cities: any[] = [];
    shipments: any[] = [];
    shipmentCost: number = 0;
    filteredCities: any[] = [];
    selectedCountry: any = '';
    selectedCity: any = '';
    name: string = '';
    email: string = '';
    phone: string = '';
    address: string = '';
    notes: string = '';
    constructor(
        public router: Router,
        private clientCartService: ClientCartService,
        private productService: ProductService,
        private cartService: CartService
    ) {}

    ngOnInit(): void {
        this.fetchCartData();
        this.fetchCitiess();
        this.fetchShipment();
        this.fetchCountries();

        const savedCheckoutData = localStorage.getItem('checkoutData');
        if (savedCheckoutData) {
            const checkoutData = JSON.parse(savedCheckoutData);
            this.selectedCountry = checkoutData.country_id || '';
            this.name = checkoutData.name || '';
            this.email = checkoutData.email || '';
            this.phone = checkoutData.phone || '';
            this.address = checkoutData.address || '';
            this.notes = checkoutData.notes || '';

            setTimeout(() => {
                this.onCountryChange();
                setTimeout(() => {
                    this.selectedCity = checkoutData.city_id || '';
                    this.onCityChange();
                }, 500);
            }, 500);
        }
    }

    fetchCountries() {
        this.cartService.allCountries().subscribe({
            next: (response) => {
                this.countries = Object.values(response)[0];
            },
        });
    }

    fetchCitiess() {
        this.cartService.allCities().subscribe({
            next: (response) => {
                this.cities = Object.values(response)[0];
            },
        });
    }
    fetchShipment() {
        this.cartService.allShipments().subscribe({
            next: (response) => {
                this.shipments = Object.values(response)[0];
            },
        });
    }

    onCountryChange() {
        this.filteredCities = this.cities.filter(
            (city) => city.country_id == this.selectedCountry
        );
        this.selectedCity = '';
        this.shipmentCost = 0;
    }

    onCityChange() {
        const shipment = this.shipments.find(
            (s) =>
                s.country_id == this.selectedCountry &&
                s.city_id == this.selectedCity
        );
        this.shipmentCost = shipment ? Number(shipment.cost) : 0;
    }

    get totalAmount(): number {
        return (
            this.data?.reduce(
                (sum: any, cart: any) => sum + cart.total_price,
                0
            ) || 0
        );
    }

    fetchCartData() {
        this.clientCartService.client_cart$.subscribe((client_cart) => {
            this.cartItems = client_cart || [];
            this.calculateTotal();
        });
    }
    calculateTotal() {
        this.totalPrice = this.cartItems.reduce((acc, cart) => {
            return acc + cart.product.priceAfterDiscount * cart.quantity;
        }, 0);
    }

    changeQuantity(productId: number, change: number) {
        this.clientCartService.updateQuantity(productId, change);
        this.calculateTotal();
    }

    removeItem(productId: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to remove this item from the cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
        }).then((result: any) => {
            if (result.isConfirmed) {
                try {
                    this.clientCartService.removeFromCart(productId);
                    this.clientCartService.refreshCart();

                    Swal.fire({
                        title: 'Removed!',
                        text: 'Product removed from cart successfully.',
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

    clearCart() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to clear the cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, clear it!',
            cancelButtonText: 'Cancel',
        }).then((result: any) => {
            if (result.isConfirmed) {
                try {
                    this.clientCartService.clearCart();

                    this.clientCartService.refreshCart();

                    localStorage.removeItem('checkoutData');
                    localStorage.removeItem('totalPriceData');
                    Swal.fire({
                        title: 'clear!',
                        text: 'Your cart is clear.',
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

    checkout() {
        const orderItems = {
            orderItems: this.cartItems.map((cart) => ({
                product_id: cart.product.id,
                quantity: cart.quantity,
            })),
            name: this.name,
            email: this.email,
            phone: this.phone,
            address: this.address,
            country_id: this.selectedCountry,
            city_id: this.selectedCity,
            notes: this.notes,
        };

        const selectedCountryObj = this.countries.find(
            (country) => country.id === +this.selectedCountry
        );

        const selectedCityObj = this.cities.find(
            (city) => city.id === +this.selectedCity
        );
        const address = (
            document.getElementById('address') as HTMLTextAreaElement
        )?.value.trim();

        if (!this.selectedCountry || !this.selectedCity || !address) {
            this.errorMessage =
                'Please add your address {country, city, address}';
            setTimeout(() => {
                this.errorMessage = '';
            }, 3000);
            return;
        } else if (!this.name || !this.phone || !this.email) {
            this.errorMessage = 'Please add your data {name, email, phone}';
            setTimeout(() => {
                this.errorMessage = '';
            }, 3000);
            return;
        }

        const totalPriceData = {
            country: selectedCountryObj ? selectedCountryObj.name : 'N/A',
            city: selectedCityObj ? selectedCityObj.name : 'N/A',
            totalAmount: this.totalPrice,
            shipmentCost: this.shipmentCost,
            finalPrice: this.finalPrice,
        };

        localStorage.setItem('checkoutData', JSON.stringify(orderItems));
        localStorage.setItem('totalPriceData', JSON.stringify(totalPriceData));

        this.router.navigate(['/checkout']);
    }

    get finalPrice(): number {
        return this.totalPrice + this.shipmentCost;
    }
}
