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
import { provideNativeDateAdapter } from "@angular/material/core";

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        provideHttpClient(),
        { provide: LOCALE_ID, useValue: 'ru' },
        provideNativeDateAdapter(),
        importProvidersFrom(
            AngularFireModule.initializeApp(environment.firebase),
            AngularFirestoreModule
        ),
    ],
};
