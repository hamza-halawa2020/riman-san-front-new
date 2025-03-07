import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './token.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])), // Existing HTTP client with interceptor
        provideZoneChangeDetection({ eventCoalescing: true }), // Zone.js optimization
        provideRouter(routes), // Routing
        provideClientHydration(), // Client-side hydration
        provideAnimationsAsync(), // Animations
        CookieService, // Cookie service
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            })
        ), // Add TranslateModule with HTTP loader
    ],
};
