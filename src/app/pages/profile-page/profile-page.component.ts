import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { ProfileService } from './profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { OrderComponent } from './orders/orders.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        CommonModule,
        OrderComponent,
        FormsModule,
    ],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
    image = environment.imgUrl + 'users/';
    data: any;
    activeSection: string = 'data';
    showImageModal: boolean = false;
    selectedAddress: any = null;
    showEditModal: boolean = false;
    showDeleteModal: boolean = false;
    showProfileEditModal: boolean = false; // New modal for profile edit
    editedProfile: any = {}; // Object to hold edited profile data
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private profileService: ProfileService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.profileService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (err) => {
                (this.errorMessage = 'Error fetching profile address'), err;
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    setActiveSection(section: string) {
        this.activeSection = section;
    }

    openImageModal() {
        this.showImageModal = true;
    }

    closeImageModal() {
        this.showImageModal = false;
    }

    // Address Edit
    openEditAddressModal(address: any) {
        this.selectedAddress = { ...address };
        this.showEditModal = true;
    }

    saveAddress() {
        if (this.selectedAddress) {
            this.profileService
                .updateAddress(this.selectedAddress.id, this.selectedAddress)
                .subscribe({
                    next: (response) => {
                        const index = this.data.addresses.findIndex(
                            (a: any) => a.id === this.selectedAddress.id
                        );
                        if (index !== -1) {
                            this.data.addresses[index] = {
                                ...this.selectedAddress,
                            };
                        }
                        this.successMessage = 'Your address Updated!';
                        setTimeout(() => {
                            this.successMessage = '';
                        }, 3000);

                        this.closeModal();
                    },
                    error: (err) => {
                        (this.errorMessage = 'Error updating address'), err;
                        setTimeout(() => {
                            this.errorMessage = '';
                        }, 3000);
                    },
                });
        }
    }

    // Address Delete
    openDeleteAddressModal(address: any) {
        this.selectedAddress = address;
        this.showDeleteModal = true;
    }

    deleteAddress() {
        if (this.selectedAddress) {
            this.profileService
                .deleteAddress(this.selectedAddress.id)
                .subscribe({
                    next: () => {
                        this.data.addresses = this.data.addresses.filter(
                            (a: any) => a.id !== this.selectedAddress.id
                        );
                        this.closeModal();
                        this.successMessage = 'Your address Deleted!';
                        setTimeout(() => {
                            this.successMessage = '';
                        }, 3000);
                    },
                    error: (err) => {
                        (this.errorMessage = 'Error deleting address'), err;
                        setTimeout(() => {
                            this.errorMessage = '';
                        }, 3000);
                    },
                });
        }
    }

    // Profile Edit
    openProfileEditModal() {
        this.editedProfile = {
            name: this.data.name,
            email: this.data.email,
            phone: this.data.phone || '',
            image: this.data.image,
            password: '', // Optional field for password change
        };
        this.showProfileEditModal = true;
    }

    saveProfile() {
        const formData = new FormData();
        formData.append('name', this.editedProfile.name);
        formData.append('email', this.editedProfile.email);
        formData.append('phone', this.editedProfile.phone);
        if (this.editedProfile.image instanceof File) {
            formData.append('image', this.editedProfile.image);
        }
        if (this.editedProfile.password) {
            formData.append('password', this.editedProfile.password);
        }

        this.profileService.updateProfile(this.data.id, formData).subscribe({
            next: (response) => {
                this.data = { ...this.data, ...response.data }; // Merge response data
                this.fetchdata();
                this.showProfileEditModal = false;
                this.editedProfile = {};
                this.cdr.detectChanges(); // Manually trigger change detection

                this.successMessage = 'Your Profile Updated!';
                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            },
            error: (err) => {
                (this.errorMessage = 'Error updating profile'), err;
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    onFileChange(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.editedProfile.image = event.target.files[0]; // Store the file object
        }
    }

    closeModal() {
        this.showEditModal = false;
        this.showDeleteModal = false;
        this.showProfileEditModal = false;
        this.selectedAddress = null;
        this.editedProfile = {};
    }
}
