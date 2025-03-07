import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-mission',
    standalone: true,
    imports: [RouterLink, TranslateModule],
    templateUrl: './mission.component.html',
    styleUrl: './mission.component.scss',
})
export class MissionComponent {}
