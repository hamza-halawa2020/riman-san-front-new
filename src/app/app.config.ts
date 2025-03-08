import {
    ApplicationConfig,
    provideZoneChangeDetection,
    APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './token.interceptor';
import { CookieService } from 'ngx-cookie-service';
import {
    TranslateModule,
    TranslateLoader,
    TranslateService,
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';

// Custom TranslateLoader
export function HttpLoaderFactory(http: HttpClient) {
    return {
        getTranslation: (lang: string) =>
            http
                .get(`${environment.backEndUrl}/translations/index`)
                .pipe(map((data: any) => data[lang] || {})),
    } as TranslateLoader;
}

// App Initializer to preload translations
export function initializeApp(
    translate: TranslateService,
    http: HttpClient
): () => Observable<any> {
    return () => {
        return http.get(`${environment.backEndUrl}/translations/index`).pipe(
            map((data: any) => {
                translate.setTranslation('en', data['en'] || {});
                translate.setTranslation('ar', data['ar'] || {});
                translate.setDefaultLang('en'); // Set default language
                translate.use('en'); // Use 'en' initially (or based on user preference)
            })
        );
    };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(),
        provideAnimationsAsync(),
        CookieService,
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            })
        ),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [TranslateService, HttpClient],
            multi: true,
        },
    ],
};
