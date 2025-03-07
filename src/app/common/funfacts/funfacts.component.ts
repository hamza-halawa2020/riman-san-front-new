import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-funfacts',
    standalone: true,
    imports: [RouterLink,TranslateModule],
    templateUrl: './funfacts.component.html',
    styleUrl: './funfacts.component.scss'
})
export class FunfactsComponent {}