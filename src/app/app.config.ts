import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient } from "@angular/common/http";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { environment } from "../environments/environment";
import { registerLocaleData } from "@angular/common";
import localeRu from "@angular/common/locales/ru";
import { provideNativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { CustomRuDateAdapter } from "./core/custom-ru-date-adapter";
import { CUSTOM_RU_DATE_FORMATS } from './core/date-formats';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(),
        { provide: LOCALE_ID, useValue: 'ru' },
        { provide: DateAdapter, useClass: CustomRuDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: CUSTOM_RU_DATE_FORMATS },
        importProvidersFrom(
            AngularFireModule.initializeApp(environment.firebase),
            AngularFirestoreModule
        ),
    ],
};
