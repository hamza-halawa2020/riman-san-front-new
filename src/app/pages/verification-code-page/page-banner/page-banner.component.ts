import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-page-banner:not(6)',
    standalone: true,
    imports: [RouterLink, TranslateModule],
    templateUrl: './page-banner.component.html',
    styleUrl: './page-banner.component.scss',
})
export class PageBannerComponent {}
