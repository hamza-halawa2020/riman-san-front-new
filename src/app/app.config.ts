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

// Custom TranslateLoader with versioning
export function HttpLoaderFactory(http: HttpClient) {
    return {
        getTranslation: (lang: string) => {
            const translationKey = `i18n_${lang}`;
            const versionKey = `i18n_version_${lang}`;
            const currentVersion = '1.0'; // Update this dynamically from Laravel API if possible

            const cachedTranslations = localStorage.getItem(translationKey);
            const cachedVersion = localStorage.getItem(versionKey);

            // If translations exist and the version matches, return them from localStorage
            if (cachedTranslations && cachedVersion === currentVersion) {
                return new Observable((observer) => {
                    observer.next(JSON.parse(cachedTranslations));
                    observer.complete(); // Ensure the Observable completes
                });
            } else {
                // Fetch from API, store in localStorage, and return the translations
                return http
                    .get(`${environment.backEndUrl}/translations/index`)
                    .pipe(
                        map((data: any) => {
                            const translations = data[lang] || {};
                            localStorage.setItem(
                                translationKey,
                                JSON.stringify(translations)
                            );
                            localStorage.setItem(versionKey, currentVersion);
                            return translations;
                        })
                    );
            }
        },
    } as TranslateLoader;
}

// Initialize translations during app startup
// export function initializeApp(
//     translate: TranslateService,
//     http: HttpClient
// ): () => Promise<void> {
//     return () => {
//         const defaultLang = 'en';
//         const translationKey = `i18n_${defaultLang}`;
//         const versionKey = `i18n_version_${defaultLang}`;
//         const currentVersion = '1.0'; // Update this dynamically from Laravel API if possible

//         const cachedTranslations = localStorage.getItem(translationKey);
//         const cachedVersion = localStorage.getItem(versionKey);

//         // If cached translations exist and the version is current, use them
//         if (cachedTranslations && cachedVersion === currentVersion) {
//             translate.setTranslation(
//                 defaultLang,
//                 JSON.parse(cachedTranslations)
//             );
//             translate.use(defaultLang);
//             return Promise.resolve();
//         } else {
//             // Fetch from API, store in localStorage, and set translations
//             return http
//                 .get(`${environment.backEndUrl}/translations/index`)
//                 .pipe(
//                     map((data: any) => {
//                         const translations = data[defaultLang] || {};
//                         translate.setTranslation(defaultLang, translations);
//                         localStorage.setItem(
//                             translationKey,
//                             JSON.stringify(translations)
//                         );
//                         localStorage.setItem(versionKey, currentVersion);
//                         translate.use(defaultLang);
//                     })
//                 )
//                 .toPromise();
//         }
//     };
// }

export function initializeApp(
    translate: TranslateService,
    http: HttpClient
): () => Promise<void> {
    return () => {
        const defaultLang = 'en';
        const translationKey = `i18n_${defaultLang}`;
        const versionKey = `i18n_version_${defaultLang}`;
        const currentVersion = '1.0'; // Update dynamically if possible

        const cachedTranslations = localStorage.getItem(translationKey);
        const cachedVersion = localStorage.getItem(versionKey);

        if (cachedTranslations && cachedVersion === currentVersion) {
            translate.setTranslation(
                defaultLang,
                JSON.parse(cachedTranslations)
            );
            translate.use(defaultLang);
            document.getElementById('loading-screen')?.remove(); // Remove loader
            return Promise.resolve();
        } else {
            return http
                .get(`${environment.backEndUrl}/translations/index`)
                .toPromise()
                .then((data: any) => {
                    const translations = data[defaultLang] || {};
                    translate.setTranslation(defaultLang, translations);
                    localStorage.setItem(
                        translationKey,
                        JSON.stringify(translations)
                    );
                    localStorage.setItem(versionKey, currentVersion);
                    translate.use(defaultLang);
                    document.getElementById('loading-screen')?.remove(); // Remove loader
                })
                .catch((error) => {
                    console.error('Error loading translations:', error);
                    document.getElementById('loading-screen')?.remove(); // Remove loader even on error
                });
        }
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
